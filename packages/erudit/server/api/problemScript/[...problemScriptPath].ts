import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { build, type Plugin } from 'esbuild';

import { STATIC_ASSET_EXTENSIONS } from '#layers/erudit/server/erudit/prose/transform/extensions';
import { createGlobalContent } from '@erudit-js/core/content/global';
import { eruditGlobalNames } from '#erudit/prose/global';
import { autoImportNames } from '#erudit/autoImports';

/**
 * Pure function calls irrelevant to the problem script runtime.
 * Their entire call expressions (including all arguments) are replaced with
 * `undefined` before bundling so esbuild never follows transitive imports
 * inside their arguments (e.g. heavy checker handlers importing `mathjs`).
 */
const WIPE_OUT_FUNCTIONS: string[] = [
  'defineProblemChecker',
  'defineContributor',
  'defineTopic',
  'defineBook',
  'definePage',
];

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
    plugins: [jsxRuntimePlugin, sourceTransformPlugin, staticFilesPlugin],
    alias: {
      '#project': ERUDIT.paths.project() + '/',
      '#content': ERUDIT.paths.project('content') + '/',
    },
  });

  let code = buildResult.outputFiles[0]!.text;

  // Post-build: strip redundant ERUDIT_GLOBAL declarations emitted by esbuild,
  // normalize JSX identifiers, and prepend a selective destructuring preamble
  // with only the global names actually used in the bundle.
  code = normalizeEruditGlobals(code);

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
                export const jsx = globalThis.ERUDIT_GLOBAL.jsx;
                export const jsxs = globalThis.ERUDIT_GLOBAL.jsxs;
                export const Fragment = globalThis.ERUDIT_GLOBAL.Fragment;
                export const _jsx = globalThis.ERUDIT_GLOBAL.jsx;
                export const _jsxs = globalThis.ERUDIT_GLOBAL.jsxs;
                export const _Fragment = globalThis.ERUDIT_GLOBAL.Fragment;
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

// Names that are available on globalThis.ERUDIT_GLOBAL and should not be bundled as real imports.
function getGlobalNames(): Set<string> {
  return new Set<string>([
    ...eruditGlobalNames,
    // Auto-imported names from erudit config
    ...autoImportNames,
    // Underscore-prefixed aliases for JSX
    '_jsx',
    '_jsxs',
    '_Fragment',
  ]);
}

/**
 * Replace calls to functions listed in `WIPE_OUT_FUNCTIONS` with `undefined`.
 * Uses balanced-parenthesis scanning so nested calls/objects inside arguments
 * are handled correctly.
 *
 * Example:
 *   export default defineProblemChecker(def, async (d, i) => { ... });
 *   →  export default undefined;
 */
function wipeOutCalls(source: string): string {
  const pattern = new RegExp(
    '\\b(' + WIPE_OUT_FUNCTIONS.join('|') + ')\\s*\\(',
  );

  let result = '';
  let remaining = source;

  while (true) {
    const m = pattern.exec(remaining);
    if (!m) {
      result += remaining;
      break;
    }

    // Skip function/method declarations (e.g. `function defineProblemChecker(`)
    const prefix = remaining.slice(Math.max(0, m.index - 20), m.index);
    if (/\bfunction\s*$/.test(prefix)) {
      result += remaining.slice(0, m.index + m[0].length);
      remaining = remaining.slice(m.index + m[0].length);
      continue;
    }

    // Append everything before the function name
    result += remaining.slice(0, m.index);

    // Find the opening paren position (right after the function name + optional whitespace)
    const openParenIndex = m.index + m[0].length - 1;
    let depth = 1;
    let i = openParenIndex + 1;

    // Scan forward to find the matching closing paren, skipping strings/templates
    while (i < remaining.length && depth > 0) {
      const ch = remaining[i]!;

      if (ch === '(') {
        depth++;
      } else if (ch === ')') {
        depth--;
      } else if (ch === "'" || ch === '"' || ch === '`') {
        // Skip string/template literal
        const quote = ch;
        i++;
        while (i < remaining.length) {
          const sc = remaining[i]!;
          if (sc === '\\') {
            i += 2; // skip escaped char
            continue;
          }
          if (sc === quote) break;
          i++;
        }
      } else if (ch === '/' && remaining[i + 1] === '/') {
        // Skip single-line comment
        while (i < remaining.length && remaining[i] !== '\n') i++;
        continue;
      } else if (ch === '/' && remaining[i + 1] === '*') {
        // Skip block comment
        i += 2;
        while (i < remaining.length - 1) {
          if (remaining[i] === '*' && remaining[i + 1] === '/') {
            i += 2;
            break;
          }
          i++;
        }
        continue;
      }

      i++;
    }

    // Replace the entire call expression with `undefined`
    result += 'undefined';
    remaining = remaining.slice(i);
  }

  return result;
}

/**
 * Rewrite imports of known globalThis names (JSX runtime + prose tags) from
 * real import statements to `const X = globalThis["X"]` lookups.
 * Non-global imports are left as real imports and bundled normally.
 */
function rewriteGlobalImports(
  source: string,
  globalNames: Set<string>,
): string {
  return source.replace(
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
            `var ${localName} = globalThis.ERUDIT_GLOBAL[${JSON.stringify(globalKey)}];`,
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
}

// Pre-transform: wipe out pure function calls irrelevant to problem scripts,
// then rewrite imports of known globalThis tag names → const from globalThis.
// Applies to every .ts/.tsx/.js/.jsx file esbuild processes (including utility files).

const sourceTransformPlugin: Plugin = {
  name: 'source-transform',
  setup(build) {
    const globalNames = getGlobalNames();
    build.onLoad({ filter: /\.[jt]sx?$/ }, (args) => {
      let source = readFileSync(args.path, 'utf8');

      source = wipeOutCalls(source);
      source = rewriteGlobalImports(source, globalNames);

      const ext = (args.path.match(/[jt]sx?$/)?.[0] ?? 'js') as
        | 'js'
        | 'jsx'
        | 'ts'
        | 'tsx';
      return {
        contents: source,
        loader: ext,
      };
    });
  },
};

/**
 * Post-build pass that:
 * 1. Strips all `var X = globalThis.ERUDIT_GLOBAL[...]` declarations (from
 *    rewriteGlobalImports and the jsxRuntimePlugin shim) and the shim comment.
 * 2. Normalizes underscore-prefixed JSX call-site names (_jsx2 → jsx, etc.).
 * 3. Detects which ERUDIT_GLOBAL names are actually referenced in the code.
 * 4. Prepends a single destructuring preamble with only those names.
 */
function normalizeEruditGlobals(code: string): string {
  // Strip the jsx-runtime-shim comment
  code = code.replace(/^\/\/ jsx-runtime-shim:jsx-runtime-shim\n/gm, '');

  // Strip ALL var declarations pulling from globalThis.ERUDIT_GLOBAL
  //   var jsx = globalThis.ERUDIT_GLOBAL.jsx;
  //   var P = globalThis.ERUDIT_GLOBAL["P"];
  //   var _jsx2 = globalThis.ERUDIT_GLOBAL.jsx;
  code = code.replace(
    /^var \w+ = globalThis\.ERUDIT_GLOBAL(?:\.[a-zA-Z_$][\w$]*|\[["'][a-zA-Z_$][\w$]*["']\]);[ \t]*\n?/gm,
    '',
  );

  // Normalize call-site names (_jsxs must precede _jsx to avoid partial match):
  //   _jsxs2(…)  →  jsxs(…)
  //   _jsx2(…)   →  jsx(…)
  //   _Fragment2 →  Fragment
  code = code.replace(/_jsxs\d*\b/g, 'jsxs');
  code = code.replace(/_jsx\d*\b/g, 'jsx');
  code = code.replace(/_Fragment\d*\b/g, 'Fragment');

  // Detect which ERUDIT_GLOBAL names are actually used in the code
  const allNames = getGlobalNames();
  const usedNames = [...allNames]
    .filter((n) => /^[a-zA-Z_$]\w*$/.test(n) && !n.startsWith('_'))
    .filter((n) => new RegExp('\\b' + n + '\\b').test(code));

  if (usedNames.length > 0) {
    code =
      'var { ' +
      usedNames.join(', ') +
      ' } = globalThis.ERUDIT_GLOBAL;\n' +
      code;
  }

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
