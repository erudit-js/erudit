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
import { setupServerImporter } from './importer';
import { setupServerRepository } from './repository';
import { setupServerContentNav } from './content/nav/setup';

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
    //await new Promise((resolve) => setTimeout(resolve, 100));
    await import('#erudit/prose/tags');
    await setupServerRuntimeConfig();
    await setupServerLogger();
    await setupServerImporter();
    await setupServerProjectWatcher();
    await setupServerLanguage();
    await setupServerDatabase();
    await setupServerRepository();
    await setupServerContentNav();
    ERUDIT.log.success(chalk.green('Setup Complete!'));
    await buildServerErudit();
}

async function closeServer() {
    await closeServerProjectWatcher();
}
