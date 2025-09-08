import { createJiti, type Jiti } from 'jiti';

import { defineContributor } from '@erudit/module/globals/contributor';
import { defineSponsor } from '@erudit/module/globals/sponsor';
import { defineBook } from '@erudit/module/globals/book';

export type EruditServerImporter = Jiti['import'];

export let jiti: Jiti;

export async function setupServerImporter() {
    jiti = createJiti(ERUDIT.config.paths.project, {
        fsCache: true,
        moduleCache: false,
        jsx: {
            runtime: 'automatic',
            importSource: 'jsprose/dsl',
        },
    });

    ERUDIT.import = jiti.import;

    Object.assign(globalThis, {
        defineContributor,
        defineSponsor,
        defineBook,
    });

    ERUDIT.log.success('Importer setup complete!');
}
