import { resolve } from 'node:path';
import { build, type Plugin } from 'esbuild';

import { STATIC_ASSET_EXTENSIONS } from '#layers/erudit/server/erudit/prose/transform/extensions';
import { createGlobalContent } from '@erudit-js/core/content/global';

export default defineEventHandler<Promise<string>>(async (event) => {
  // <filepathToScriptFile>.js
  const problemScriptPath = event.context.params!.problemScriptPath.slice(
    0,
    -3,
  ); // remove .js

  const buildResult = await build({
    entryPoints: [`${ERUDIT.paths.project(problemScriptPath)}.tsx`],
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
      '#project': ERUDIT.paths.project() + '/',
      '#content': ERUDIT.paths.project('content') + '/',
    },
  });

  let code = buildResult.outputFiles[0].text;

  // Transform $CONTENT patterns to link objects
  code = code.replace(/\$CONTENT(\.[a-zA-Z_$][\w$]*)+/g, (match) => {
    const path = match
      .slice(8) // Remove '$CONTENT.'
      .split('.')
      .join('/');

    return JSON.stringify(createGlobalContent(path));
  });

  // Insert script ID
  code = code.replace(
    'defineProblemScript(',
    `defineProblemScript('__auto_generated__',`,
  );

  setHeader(event, 'Content-Type', 'text/javascript; charset=utf-8');
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
        filter: new RegExp(`\\.(${STATIC_ASSET_EXTENSIONS.join('|')})$`),
      },
      async (args) => {
        const absPath = resolve(args.path).replace(/\\/g, '/');
        const contents = `export default ${JSON.stringify(absPath)};`;
        return { contents, loader: 'js' };
      },
    );
  },
};
