import chalk from 'chalk';

import { setupServerLogger } from './logger';
import { setupServerRuntimeConfig } from './config';
import { setupServerLanguage } from './language/setup';
import { setupServerDatabase } from './db/setup';
import { setupServerImporter } from './importer';
import { setupServerRepository } from './repository';
import { setupServerContentNav } from './content/nav/setup';
import { buildServerErudit, tryServerWatchProject } from './build';

let serverSetupPromise: Promise<void>;

export default defineNitroPlugin((nitro) => {
    serverSetupPromise = setupServer();

    nitro.hooks.hook('request', async (event) => {
        await serverSetupPromise;
        await ERUDIT.buildPromise;

        if (ERUDIT.buildError) {
            const accept = getHeader(event, 'accept') || '';
            if (accept.includes('text/html')) {
                function escapeHtml(str: string) {
                    return str
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;');
                }

                event.node.res.end(`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Erudit Build Error</title>
        <style>
        :root {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
        }
        </style>
    </head>
    <body>
    <h1>Erudit Build Error</h1>
    <pre style="padding: 1em; border-radius: 4px; overflow-x: auto;">
${escapeHtml(ERUDIT.buildError.stack || '')}
    </pre>
    </body>
</html>
  `);
            }
        }
    });

    nitro.hooks.hook('close', async () => {});
});

async function setupServer() {
    try {
        const { registerProseGlobals } = await import('#erudit/prose/global');
        registerProseGlobals();

        await setupServerRuntimeConfig();
        await setupServerLogger();
        await setupServerImporter();
        await setupServerLanguage();
        await setupServerDatabase();
        await setupServerRepository();
        await setupServerContentNav();
        ERUDIT.log.success(chalk.green('Setup Complete!'));

        await tryServerWatchProject();
        await buildServerErudit();
    } catch (buildError) {
        if (buildError instanceof Error) {
            ERUDIT.buildError = buildError;
        } else {
            ERUDIT.buildError = createError({
                statusCode: 500,
                statusMessage: 'Unknown Erudit Server Error',
                message:
                    typeof buildError === 'string'
                        ? buildError
                        : 'An unknown error occurred!',
            });
        }
    }
}
