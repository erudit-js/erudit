import { createJiti, type Jiti, type JitiOptions } from 'jiti';
import { sn } from 'unslash';
import { injectDocumentId } from 'tsprose';
import {
  pathToDocumentId,
  stringifyDocumentId,
} from '@erudit-js/core/prose/documentId';
import { insertProblemScriptId } from '@erudit-js/prose/elements/problem/problemScript';

import {
  EXTENSIONS,
  STATIC_ASSET_EXTENSIONS,
} from './prose/transform/extensions';

export type EruditServerImporter = Jiti['import'];

export let jiti: Jiti;

/** Cached list of valid identifier keys from ERUDIT_GLOBAL. */
let cachedGlobalKeys: string[] | undefined;

function getGlobalKeys(): string[] {
  if (cachedGlobalKeys !== undefined) return cachedGlobalKeys;

  const eg = (globalThis as any).ERUDIT_GLOBAL;
  if (!eg || typeof eg !== 'object') {
    cachedGlobalKeys = [];
    return cachedGlobalKeys;
  }

  cachedGlobalKeys = Object.keys(eg).filter((n) => /^[a-zA-Z_$]\w*$/.test(n));
  return cachedGlobalKeys;
}

/**
 * Collect names already declared in the transpiled code via imports.
 * Jiti transpiles ESM imports to CJS-style interop, so we match patterns like:
 *   const/var/let { X, Y } = require(...)   — destructured CJS
 *   const/var/let X = require(...)          — default CJS
 *   const/var/let X = ...                   — interop helpers
 *   import { X } from '...'                — preserved ESM (if any)
 */
function collectDeclaredNames(code: string): Set<string> {
  const declared = new Set<string>();

  // Destructured require/import: const/var/let { X, Y as Z } = require(...)
  // or: import { X, Y as Z } from '...'
  const destructuredPattern =
    /\b(?:const|let|var)\s+\{([^}]+)\}\s*=\s*require\s*\(|\bimport\s+\{([^}]+)\}\s+from\s+/g;
  let m;
  while ((m = destructuredPattern.exec(code)) !== null) {
    const bindings = m[1] ?? m[2];
    if (!bindings) continue;
    for (const part of bindings.split(',')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      // Handle "X as Y" (import) or "X: Y" (destructured require)
      const asMatch = trimmed.match(/\w+\s+as\s+(\w+)/);
      if (asMatch) {
        declared.add(asMatch[1]!);
        continue;
      }
      const colonMatch = trimmed.match(/\w+\s*:\s*(\w+)/);
      if (colonMatch) {
        declared.add(colonMatch[1]!);
        continue;
      }
      const nameOnly = trimmed.match(/^(\w+)$/);
      if (nameOnly) declared.add(nameOnly[1]!);
    }
  }

  // Simple declarations: const/var/let X = require(...) or interop helpers
  const simplePattern = /\b(?:const|let|var)\s+(\w+)\s*=/g;
  let sm;
  while ((sm = simplePattern.exec(code)) !== null) {
    declared.add(sm[1]!);
  }

  return declared;
}

/**
 * Build a per-file preamble that destructures ERUDIT_GLOBAL keys, skipping
 * any names the file already declares via explicit imports.
 */
function buildFilteredPreamble(code: string): string {
  const allKeys = getGlobalKeys();
  if (allKeys.length === 0) return '';

  const declared = collectDeclaredNames(code);
  const filtered =
    declared.size > 0 ? allKeys.filter((n) => !declared.has(n)) : allKeys;

  if (filtered.length === 0) return '';

  return 'var { ' + filtered.join(', ') + ' } = globalThis.ERUDIT_GLOBAL;\n';
}

export async function setupServerImporter() {
  const jitiId = ERUDIT.paths.project();
  const defaultJiti = createJiti(jitiId, createBaseJitiOptions());
  const getDefaultCode = defaultJiti.transform.bind(defaultJiti);

  jiti = createJiti(jitiId, {
    ...createBaseJitiOptions(),
    extensions: EXTENSIONS.map((ext) => '.' + ext),
    transform: (opts) => {
      if (!opts.filename) {
        return { code: getDefaultCode(opts) };
      }

      const filename = sn(opts.filename).replace('file://', '');

      const staticAssetModule = tryStaticAssetModule(filename);
      if (staticAssetModule) {
        return staticAssetModule;
      }

      let code = getDefaultCode(opts);

      //
      // Inject ERUDIT_GLOBAL preamble for project files
      // Destructures all erudit globals (tags, defineX, jsx runtime, etc.)
      // into local variables so bare identifiers resolve correctly.
      //
      if (filename.startsWith(ERUDIT.paths.project() + '/')) {
        const preamble = buildFilteredPreamble(code);
        if (preamble) {
          code = preamble + code;
        }
      }

      //
      // Insert IDs in `defineDocument(...)` calls
      //

      const documentId = pathToDocumentId(filename, ERUDIT.paths.project());

      if (documentId) {
        code = injectDocumentId(
          stringifyDocumentId(documentId),
          code,
          'defineProse',
        );
      }

      //
      // Problem Scripts
      //

      code = insertProblemScriptId(toRelPath(filename), code);

      //
      // Rebind problem script creator src to this file's path.
      //
      // When defineProblemScript is called inside a shared utility file (e.g.
      // shared.tsx) and then re-exported through an entry file (e.g.
      // my-script.tsx), jiti injects the *shared* file's path as the scriptSrc.
      // That makes the client fetch `/api/problemScript/.../shared.js`, which has
      // no default export and fails at runtime.
      //
      // After the module's own code runs we inspect its default export: if it is
      // a ProblemScriptInstanceCreator (a function whose return value has a
      // `.generate` method), we wrap it so every created instance gets its
      // scriptSrc replaced with **this** file's relative path – the actual entry
      // file the API route will serve.
      //
      if (!filename.startsWith(ERUDIT.paths.project() + '/')) {
        return { code };
      }

      const relFilePath = toRelPath(filename).replace(/\.[jt]sx?$/, '');
      code += `
;(function() {
  var _eruditFileSrc = ${JSON.stringify(relFilePath)};
  var _def = exports.default;
  if (typeof _def !== 'function') return;
  exports.default = Object.assign(function() {
    var instance = _def.apply(this, arguments);
    if (instance && typeof instance === 'object' && typeof instance.generate === 'function') {
      return Object.assign({}, instance, { scriptSrc: _eruditFileSrc });
    }
    return instance;
  }, _def);
})();`;

      return { code };
    },
  });

  ERUDIT.import = jiti.import;

  ERUDIT.log.success('Importer setup complete!');
}

function createBaseJitiOptions(): JitiOptions {
  return {
    fsCache: false,
    moduleCache: false,
    alias: {
      '#project/': ERUDIT.paths.project() + '/',
      '#content/': ERUDIT.paths.project('content') + '/',
    },
    jsx: {
      runtime: 'automatic',
      importSource: 'tsprose',
    },
  };
}

function toRelPath(filename: string): string {
  const projectPath = ERUDIT.paths.project();
  if (filename.startsWith(projectPath + '/')) {
    return filename.slice(projectPath.length + 1);
  }
  return filename;
}

function tryStaticAssetModule(filename: unknown) {
  if (
    typeof filename === 'string' &&
    STATIC_ASSET_EXTENSIONS.some((ext) => filename.endsWith('.' + ext))
  ) {
    return {
      code: `exports.default = "${toRelPath(filename)}";`,
    };
  }
}
