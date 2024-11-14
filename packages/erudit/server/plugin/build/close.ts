import { debug, logger } from '@server/logger';
import { ERUDIT_SERVER } from '@server/global';

export async function close() {
    debug.start('Shutting down server...');

    await ERUDIT_SERVER.DB?.destroy();

    logger.success('Server shut down gracefully!');
}
