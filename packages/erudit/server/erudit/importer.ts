import { createJiti, type Jiti, type JitiOptions } from 'jiti';
import slash from 'slash';
import {
    pathToDocumentId,
    stringifyDocumentId,
} from '@erudit-js/core/prose/documentId';

import {
    EXTENSIONS,
    STATIC_ASSET_EXTENSIONS,
} from './prose/transform/extensions';
import { insertDocumentId } from '@jsprose/core';

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

            // @TODO: add ids to defineTopic, definePage, defineBook, defineGroup too

            //console.log(code);

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
