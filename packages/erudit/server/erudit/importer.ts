import { createJiti, type Jiti, type JitiOptions } from 'jiti';
import slash from 'slash';
import { insertDocumentId } from '@jsprose/core';
import {
    insertContentId,
    pathToContentId,
} from '@erudit-js/core/content/itemId';
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
    const jitiId = ERUDIT.config.paths.project;
    const defaultJiti = createJiti(jitiId, createBaseJitiOptions());
    const getDefaultCode = defaultJiti.transform.bind(defaultJiti);

    jiti = createJiti(ERUDIT.config.paths.project, {
        ...createBaseJitiOptions(),
        extensions: EXTENSIONS.map((ext) => '.' + ext),
        transform: (opts) => {
            if (!opts.filename) {
                return { code: getDefaultCode(opts) };
            }

            const filename = slash(opts.filename).replace('file://', '');

            const staticAssetModule = tryStaticAssetModule(filename);
            if (staticAssetModule) {
                return staticAssetModule;
            }

            let code = getDefaultCode(opts);

            //
            // Handle prose documents (defineDocument)
            //

            const documentId = pathToDocumentId(
                filename,
                ERUDIT.config.paths.project,
            );

            if (documentId) {
                code = insertDocumentId({
                    code,
                    documentId: stringifyDocumentId(documentId),
                });
            }

            //
            // Handle content items (defineBook|Page|Group|Topic)
            //

            const contentId = pathToContentId(
                filename,
                ERUDIT.config.paths.project,
            );

            if (contentId) {
                code = insertContentId(code, contentId);
            }

            //
            // Handle problem scripts
            //

            code = insertProblemScriptId(filename, code);

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
            '#project/': ERUDIT.config.paths.project + '/',
            '#content/': ERUDIT.config.paths.project + '/content/',
            '#contributors':
                ERUDIT.config.paths.build + '/nuxt/.nuxt/#erudit/contributors',
        },
        jsx: {
            runtime: 'automatic',
            importSource: '@jsprose/core',
        },
    };
}

function tryStaticAssetModule(filename: unknown) {
    if (
        typeof filename === 'string' &&
        STATIC_ASSET_EXTENSIONS.some((ext) => filename.endsWith('.' + ext))
    ) {
        return {
            code: `exports.default = "${filename}";`,
        };
    }
}
