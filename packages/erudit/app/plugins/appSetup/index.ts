// Global setups
import { setupAppRuntimeConfig } from './config';

// Client setups
import { setupHtmlBranding } from './client/htmlBranding';
import { setupWelcomeMessage } from './client/welcome';

export default defineNuxtPlugin({
    name: 'erudit-app-setup',
    async setup() {
        // Forgive me God for doing this but this is necessary because Nuxt App server side shares
        // same globalThis with Nitro server but same imports are done again causing @jsprose/core to throw "multipe singleton instances" error.
        // @ts-ignore
        delete globalThis['__JSPROSE__'];

        await setupAppRuntimeConfig();
    },
    hooks: {
        'app:mounted': async () => {
            await import('#erudit/prose/core');
            await setupHtmlBranding();
            await setupWelcomeMessage();
        },
    },
});
