import { defineNuxtModule } from 'nuxt/kit';

import { version } from '../../package.json';
import { moduleLogger } from './logger';
import { setupWatchers } from './watcher';
import { ERUDIT_PATH, PROJECT_PATH } from './env';

// Setup procedures
import { setupEruditRuntimeConfig } from './setup/runtimeConfig';
import { setupEruditFullRestart } from './setup/fullRestart';
import { setupEruditPublicAssets } from './setup/publicAssets';
import {
    registerAppGlobals,
    registerGlobalContentTypes,
    registerModuleGlobals,
    registerServerGlobals,
} from './setup/globals';
import { setupProseElements } from './setup/elements/setup';

export default defineNuxtModule({
    meta: { name: 'Erudit', configKey: 'erudit', version },
    async setup(_, nuxt) {
        moduleLogger.start('Setting up Erudit module...');

        await registerModuleGlobals();
        await registerAppGlobals();
        await registerServerGlobals();
        await registerGlobalContentTypes();

        const { eruditRuntimeConfig, nuxtAugmentations } =
            await setupEruditRuntimeConfig(nuxt);
        await setupWatchers(nuxt);
        await setupEruditFullRestart(nuxt);
        await setupEruditPublicAssets(nuxt);
        await setupProseElements(nuxt, eruditRuntimeConfig);

        if (nuxtAugmentations) {
            for (const augment of nuxtAugmentations) {
                await augment({
                    nuxt,
                    nitro: nuxt.options.nitro,
                    projectPath: PROJECT_PATH,
                    eruditPath: ERUDIT_PATH,
                });
            }
        }

        moduleLogger.success('Erudit module setup complete!');
    },
});
