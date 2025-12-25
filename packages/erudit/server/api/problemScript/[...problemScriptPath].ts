import { resolve } from 'node:path';
import { build, type Plugin } from 'esbuild';
import { parseProblemScriptId } from '@erudit-js/prose/elements/problem/problemScript';

import { STATIC_ASSET_EXTENSIONS } from '@erudit/server/prose/transform/extensions';
import { tranformGlobalLinkString } from '@erudit/server/link/global';

export default defineEventHandler<Promise<string>>(async (event) => {
    // <filepathToScriptFile>/<scriptExportName>.js
    const problemScriptPath = event.context.params!.problemScriptPath.slice(
        0,
        -3,
    ); // remove .js

    let { scriptSrc, exportName } = parseProblemScriptId(problemScriptPath);

    const buildResult = await build({
        stdin: {
            contents: `
                import { ${exportName} } from '#project/${scriptSrc}';
                export default ${exportName};
            `,
            resolveDir: scriptSrc.split('/').slice(0, -1).join('/'),
            sourcefile: scriptSrc.split('/').slice(-1)[0],
            loader: 'ts',
        },
        charset: 'utf8',
        bundle: true,
        treeShaking: true,
        platform: 'neutral',
        format: 'esm',
        write: false,
        define: {
            $CONTRIBUTOR: '{}',
        },
        jsx: 'automatic',
        plugins: [jsxRuntimePlugin, staticFilesPlugin],
        alias: {
            '#project': ERUDIT.config.paths.project + '/',
            '#content': ERUDIT.config.paths.project + '/content/',
        },
    });

    let code = buildResult.outputFiles[0].text;

    // Transform $LINK patterns to link objects
    code = code.replace(/\$LINK(\.[a-zA-Z_$][\w$]*)+/g, (match) => {
        const path = match
            .slice(6) // Remove '$LINK.'
            .split('.')
            .join('/');
        return `{ __link: '${tranformGlobalLinkString(path)}' }`;
    });

    // Insert script ID
    code = code.replace(
        ' = defineProblemScript(',
        ` = defineProblemScript('__auto_generated__',`,
    );

    setHeader(event, 'Content-Type', 'text/javascript');
    return code;
});

const jsxRuntimePlugin: Plugin = {
    name: 'jsx-runtime',
    setup(build) {
        build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({
            path: 'jsx-runtime-shim',
            namespace: 'jsx-runtime-shim',
        }));

        build.onLoad({ filter: /.*/, namespace: 'jsx-runtime-shim' }, () => ({
            contents: `
                export const jsx = globalThis.jsx;
                export const jsxs = globalThis.jsxs;
                export const Fragment = globalThis.Fragment;
            `,
            loader: 'js',
        }));
    },
};

const staticFilesPlugin: Plugin = {
    name: 'static-files',
    setup(build) {
        build.onLoad(
            {
                filter: new RegExp(
                    `\\.(${STATIC_ASSET_EXTENSIONS.join('|')})$`,
                ),
            },
            async (args) => {
                const absPath = resolve(args.path).replace(/\\/g, '/');
                const contents = `export default ${JSON.stringify(absPath)};`;
                return { contents, loader: 'js' };
            },
        );
    },
};
