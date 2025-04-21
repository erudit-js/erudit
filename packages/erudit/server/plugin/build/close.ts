import { debug, logger } from '@server/logger';
import { ERUDIT_SERVER } from '@server/global';

export async function close() {
    debug.start('Shutting down server...');

    if (ERUDIT_SERVER.DB && ERUDIT_SERVER.DB.isInitialized) {
        await ERUDIT_SERVER.DB.destroy();
    }

    logger.success('Server shut down gracefully!');
}
