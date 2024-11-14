import { defineNuxtModule, updateTemplates } from 'nuxt/kit';

import { registerGlobals } from '@erudit/globals/register';
import { setupRestartWatcher } from '@erudit/module/restart';
import { setupEruditConfig } from '@erudit/module/config';
import { logger } from '@erudit/module/logger';
import { setupGlobalImports } from '@erudit/module/imports';
import { setupBitranConfig } from './bitran';
import { setupGlobalPaths } from './paths';

export default defineNuxtModule({
    meta: { name: 'Erudit', configKey: 'erudit' },
    async setup(_options, _nuxt) {
        if (_nuxt.options.dev) setupRestartWatcher(_nuxt);

        setupGlobalImports();
        registerGlobals();

        const eruditConfig = await setupEruditConfig(_nuxt);
        await setupBitranConfig(_nuxt);
        setupGlobalPaths(_nuxt);

        if (eruditConfig.site?.baseUrl) {
            const newBaseUrl = eruditConfig.site.baseUrl;
            _nuxt.options.app.baseURL = newBaseUrl;
            _nuxt.options.nitro.runtimeConfig!.app!.baseURL = newBaseUrl;
            await updateTemplates();
        }

        {
            // Handle sub dependencies
            const subDeps = eruditConfig.subDeps || [];

            const transpile = (_nuxt.options.build.transpile ||= []);
            const optimizeDeps = _nuxt.options.vite.optimizeDeps || {};
            const optimizeDepsInclude = (optimizeDeps.include ||= []);

            transpile.push(...subDeps);
            optimizeDepsInclude.push(...subDeps);
        }

        // TODO: Watch for contributors folder and create/update template with their IDs
        // TODO: Create such helpers for other features!

        logger.success('Erudit module setup complete!');
    },
});
