import { defineNuxtModule } from 'nuxt/kit';

import { version } from '../../package.json';
import { moduleLogger } from './logger';

// Setup procedures
import { setupEruditRuntimeConfig } from './setup/runtimeConfig';
import { setupEruditFullRestart } from './setup/fullRestart';
import { setupEruditAliases } from './setup/aliases';
import { addEruditProjectConfigToRuntime } from './setup/projectConfig';
import { setupEruditPublicAssets } from './setup/publicAssets';
import { setupEruditBitranTemplates } from './setup/bitranTemplates';
import { setupEruditCustomBaseUrl } from './setup/baseUrl';
import { optimizeTranspileEruditDependencies } from './setup/optimizeTranspile';
import { setupEruditNuxtConfig } from './setup/nuxtConfig';
import {
    registerAppGlobals,
    registerGlobalContentTypes,
    registerModuleGlobals,
    registerServerGlobals,
} from './setup/globals';

export default defineNuxtModule({
    meta: { name: 'Erudit', configKey: 'erudit', version },
    async setup(options, nuxt) {
        moduleLogger.start('Setting up Erudit module...');

        const { eruditRuntimeConfig, eruditPublicRuntimeConfig } =
            await setupEruditRuntimeConfig(nuxt);

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
        await setupEruditBitranTemplates(nuxt, eruditRuntimeConfig);
        await setupEruditCustomBaseUrl(nuxt, eruditPublicRuntimeConfig);
        await optimizeTranspileEruditDependencies(nuxt, eruditRuntimeConfig);
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
