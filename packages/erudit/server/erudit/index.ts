import chalk from 'chalk';

import {
    buildServerErudit,
    closeServerProjectWatcher,
    setupServerProjectWatcher,
} from './build';
import { setupServerLogger } from './logger';
import { setupServerRuntimeConfig } from './config';
import { setupServerLanguage } from './language/setup';
import { setupServerDatabase } from './db/setup';
import { closeServerDatabase } from './db/close';
import { setupServerImporter } from './importer';
import { setupEruditRepository } from './repository';

let serverSetupPromise: Promise<void>;

export default defineNitroPlugin((nitro) => {
    serverSetupPromise = setupServer();

    nitro.hooks.hook('request', async () => {
        await serverSetupPromise;
        await ERUDIT.buildPromise;
    });

    nitro.hooks.hook('close', async () => {
        await closeServer();
    });
});

async function setupServer() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await setupServerRuntimeConfig();
    await setupServerLogger();
    await setupServerImporter();
    await setupServerProjectWatcher();
    await setupServerLanguage();
    await setupServerDatabase();
    await setupEruditRepository();
    ERUDIT.log.success(chalk.green('Setup Complete!'));
    await buildServerErudit();
}

async function closeServer() {
    await closeServerDatabase();
    await closeServerProjectWatcher();
}
