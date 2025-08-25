import { createJiti, type Jiti } from 'jiti';

export type EruditServerImporter = Jiti['import'];

export async function setupServerImporter() {
    const jiti = createJiti(ERUDIT.config.paths.project, {
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
