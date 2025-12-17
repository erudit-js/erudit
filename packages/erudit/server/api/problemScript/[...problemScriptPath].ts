import { resolve } from 'node:path';
import { build, type Plugin } from 'esbuild';
import { parseProblemScriptId } from '@erudit-js/prose/elements/problem/problemScript';

import { STATIC_ASSET_EXTENSIONS } from '@erudit/server/prose/transform/extensions';

export default defineEventHandler<Promise<string>>(async (event) => {
    // <filepathToScriptFile>/<scriptExportName>.js
    const problemScriptPath = event.context.params!.problemScriptPath.slice(
        0,
        -3,
    ); // remove .js

    let { scriptSrc, scriptName } = parseProblemScriptId(problemScriptPath);

    //scriptSrc = ERUDIT.config.paths.project + '/' + scriptSrc;

    const buildResult = await build({
        stdin: {
            contents: `
                import { ${scriptName} } from '#project/${scriptSrc}';
                export default ${scriptName};
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
        jsx: 'automatic',
        plugins: [jsxRuntimePlugin, staticFilesPlugin],
        alias: {
            '#project': ERUDIT.config.paths.project + '/',
            '#content': ERUDIT.config.paths.project + '/content/',
            '#contributors':
                ERUDIT.config.paths.build + '/nuxt/.nuxt/#erudit/contributors',
        },
    });

    let code = buildResult.outputFiles[0].text;

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
