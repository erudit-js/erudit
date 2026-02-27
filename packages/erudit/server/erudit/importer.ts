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
