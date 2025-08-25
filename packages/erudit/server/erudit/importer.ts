import { createJiti, type Jiti } from 'jiti';

export type EruditServerImporter = Jiti['import'];

export let jiti: Jiti;

export async function setupServerImporter() {
    jiti = createJiti(ERUDIT.config.paths.project, {
        fsCache: false,
        moduleCache: false,
    });

    ERUDIT.import = jiti.import;

    Object.assign(globalThis, {
        defineServerBitran,
        defineContributor,
        defineSponsor,
    });

    ERUDIT.log.success('Importer setup complete!');
}
