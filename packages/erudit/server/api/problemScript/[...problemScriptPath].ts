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

  // Normalize all jsx/jsxs/Fragment shim variables emitted by esbuild
  code = normalizeJsxShims(code);

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
      // Export both the canonical and underscore-prefixed names so that
      // pre-built modules importing `jsx as _jsx` also resolve correctly.
      contents: `
                export const jsx = globalThis.jsx;
                export const jsxs = globalThis.jsxs;
                export const Fragment = globalThis.Fragment;
                export const _jsx = globalThis.jsx;
                export const _jsxs = globalThis.jsxs;
                export const _Fragment = globalThis.Fragment;
            `,
      loader: 'js',
    }));
  },
};

// Maps underscore-prefixed JSX names (emitted by some bundlers/transpilers) to
// the canonical globalThis key where the value actually lives.
const JSX_UNDERSCORE_ALIASES: Record<string, string> = {
  _jsx: 'jsx',
  _jsxs: 'jsxs',
  _Fragment: 'Fragment',
};

// Names that are available on globalThis and should not be bundled as real imports
const globalNames = new Set<string>([
  // JSX runtime
  'jsx',
  '_jsx',
  'jsxs',
  '_jsxs',
  'Fragment',
  '_Fragment',
  // Prose tag names registered in globalThis
  ...Object.values(coreElements).flatMap((el: any) =>
    (el.tags ?? []).map((t: any) => String(t.tagName)),
  ),
]);

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
            if (globalNames.has(localName)) {
              // Underscore-prefixed JSX names (_jsx, _jsxs, _Fragment) must resolve
              // to the canonical globalThis key (jsx, jsxs, Fragment) because the
              // runtime only registers the un-prefixed versions.
              const globalKey = JSX_UNDERSCORE_ALIASES[localName] ?? localName;
              shimLines.push(
                `const ${localName} = globalThis[${JSON.stringify(globalKey)}];`,
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

/**
 * Post-build pass that removes redundant var declarations pulling jsx/jsxs/Fragment
 * from globalThis (emitted by esbuild shims and proseGlobalsPlugin) and normalizes
 * all underscore-prefixed call-site names (_jsx2, _jsxs3, _Fragment, …) back to
 * their canonical forms so the output is clean and doesn't reference undefined globals.
 *
 * After this transform, `jsx`, `jsxs`, and `Fragment` are bare identifiers resolved
 * from globalThis at runtime (window.jsx etc. registered by registerProseGlobals).
 */
function normalizeJsxShims(code: string): string {
  // Remove var declarations of the form:
  //   var jsx = globalThis.jsx;
  //   var _jsx2 = globalThis["jsx"];
  // This covers both the jsxRuntimePlugin shim and the proseGlobalsPlugin shims.
  code = code.replace(
    /^var (?:_?jsx\d*|_?jsxs\d*|_?Fragment\d*) = globalThis(?:\.[a-zA-Z_$][\w$]*|\[["'][a-zA-Z_$][\w$]*["']\]);[ \t]*\n?/gm,
    '',
  );
  // Normalize call-site names (_jsxs must precede _jsx to avoid partial match):
  //   _jsxs2(…)  →  jsxs(…)
  //   _jsx2(…)   →  jsx(…)
  //   _Fragment2 →  Fragment
  code = code.replace(/_jsxs\d*\b/g, 'jsxs');
  code = code.replace(/_jsx\d*\b/g, 'jsx');
  code = code.replace(/_Fragment\d*\b/g, 'Fragment');
  return code;
}

const staticFilesPlugin: Plugin = {
  name: 'static-files',
  setup(build) {
    build.onLoad(
      {
        filter: new RegExp(`\\.(${STATIC_ASSET_EXTENSIONS.join('|')})$`),
      },
      async (args) => {
        const absPath = resolve(args.path).replace(/\\/g, '/');
        const projectPath = ERUDIT.paths.project();
        const relPath = absPath.startsWith(projectPath + '/')
          ? absPath.slice(projectPath.length + 1)
          : absPath;
        const contents = `export default ${JSON.stringify(relPath)};`;
        return { contents, loader: 'js' };
      },
    );
  },
};
