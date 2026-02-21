import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { build, type Plugin } from 'esbuild';

import { STATIC_ASSET_EXTENSIONS } from '#layers/erudit/server/erudit/prose/transform/extensions';
import { createGlobalContent } from '@erudit-js/core/content/global';
import { coreElements } from '#erudit/prose/global';

export default defineEventHandler<Promise<string>>(async (event) => {
  // <filepathToScriptFile>.js
  const problemScriptPath = event.context.params!.problemScriptPath!.slice(
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
    plugins: [jsxRuntimePlugin, proseGlobalsPlugin, staticFilesPlugin],
    alias: {
      '#project': ERUDIT.paths.project() + '/',
      '#content': ERUDIT.paths.project('content') + '/',
    },
  });

  let code = buildResult.outputFiles[0]!.text;

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

// Collect all tag names that are registered in globalThis
const proseTagNames = new Set<string>(
  Object.values(coreElements).flatMap((el: any) =>
    (el.tags ?? []).map((t: any) => String(t.tagName)),
  ),
);

// Pre-transform: rewrite any import of a known globalThis tag name → const from globalThis.
// Non-tag imports are left as real imports and bundled normally.
// Applies recursively to every .ts/.tsx file esbuild processes (including utility files).
const proseGlobalsPlugin: Plugin = {
  name: 'prose-globals',
  setup(build) {
    build.onLoad({ filter: /\.[jt]sx?$/ }, (args) => {
      const source = readFileSync(args.path, 'utf8');

      const transformed = source.replace(
        /^import\s+\{([^}]+)\}\s+from\s+(['"])([^'"]+)\2.*$/gm,
        (_match, bindings: string, _quote: string, pkg: string) => {
          const keepParts: string[] = [];
          const shimLines: string[] = [];

          for (const part of bindings
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)) {
            // handle "ExportName as LocalName"
            const m = part.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
            if (!m) {
              keepParts.push(part);
              continue;
            }
            const localName = m[2] ?? m[1]!;
            if (proseTagNames.has(localName)) {
              shimLines.push(
                `const ${localName} = globalThis[${JSON.stringify(localName)}];`,
              );
            } else {
              keepParts.push(part);
            }
          }

          const lines: string[] = [];
          if (keepParts.length > 0)
            lines.push(`import { ${keepParts.join(', ')} } from '${pkg}';`);
          lines.push(...shimLines);
          return lines.join('\n');
        },
      );

      const ext = (args.path.match(/[jt]sx?$/)?.[0] ?? 'js') as
        | 'js'
        | 'jsx'
        | 'ts'
        | 'tsx';
      return {
        contents: transformed,
        loader: ext,
      };
    });
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
