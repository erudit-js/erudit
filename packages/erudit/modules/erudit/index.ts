import { defineNuxtModule } from 'nuxt/kit';

import { version } from '../../package.json';
import { moduleLogger } from './logger';
import { setupWatchers } from './watcher';

// Setup procedures
import { setupEruditRuntimeConfig } from './setup/runtimeConfig';
import { setupEruditFullRestart } from './setup/fullRestart';
import { setupEruditAliases } from './setup/aliases';
import { addEruditProjectConfigToRuntime } from './setup/projectConfig';
import { setupEruditPublicAssets } from './setup/publicAssets';
import { setupEruditCustomBaseUrl } from './setup/baseUrl';
import { setupEruditNuxtConfig } from './setup/nuxtConfig';
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

        const { eruditRuntimeConfig, eruditPublicRuntimeConfig } =
            await setupEruditRuntimeConfig(nuxt);

        await setupWatchers(nuxt, eruditRuntimeConfig);
        await setupEruditFullRestart(nuxt, eruditRuntimeConfig);
        await setupEruditAliases(nuxt, eruditRuntimeConfig);
        await registerModuleGlobals();
        await registerAppGlobals(eruditRuntimeConfig);
        await registerServerGlobals(eruditRuntimeConfig);
        await registerGlobalContentTypes(eruditRuntimeConfig);
        const nuxtAugmentations = await addEruditProjectConfigToRuntime(
            nuxt,
            eruditRuntimeConfig,
            eruditPublicRuntimeConfig,
        );
        await setupEruditPublicAssets(nuxt, eruditRuntimeConfig);
        await setupEruditCustomBaseUrl(nuxt, eruditPublicRuntimeConfig);
        await setupProseElements(nuxt, eruditRuntimeConfig);
        await setupEruditNuxtConfig(
            nuxt,
            eruditRuntimeConfig,
            eruditPublicRuntimeConfig,
        );

        if (nuxtAugmentations) {
            for (const augment of nuxtAugmentations) {
                await augment(nuxt);
            }
        }

        moduleLogger.success('Erudit module setup complete!');
    },
});
