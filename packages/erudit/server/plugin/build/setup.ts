import eruditConfig from '#erudit/config';

import { registerGlobals } from '@erudit/globals/register';
import { debug } from '@server/logger';
import { ERUDIT_SERVER } from '@server/global';

import { setupRebuildWatcher } from './rebuild';
import { setupDatabase } from '../db/setup';

export async function setup() {
    debug.start('Running initial setup procedures...');

    if (import.meta.dev) await setupRebuildWatcher();

    registerGlobals();
    ERUDIT_SERVER.CONFIG = eruditConfig;

    await setupDatabase();
}
