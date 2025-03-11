import { PROJECT_DIR } from '#erudit/globalPaths';
import { IMPORT } from '@server/importer';
import { ERUDIT_SERVER } from '@server/global';

export async function setupBitranConfig() {
    try {
        ERUDIT_SERVER.BITRAN_CONFIG = (
            await IMPORT(PROJECT_DIR + '/bitran.ts')
        ).default;
    } catch {}
}
