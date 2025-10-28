// Global setups
import { setupAppRuntimeConfig } from './config';

// Client setups
import { setupHtmlBranding } from './client/htmlBranding';
import { setupWelcomeMessage } from './client/welcome';

export default defineNuxtPlugin({
    name: 'erudit-app-setup',
    async setup() {
        await setupAppRuntimeConfig();
    },
    hooks: {
        'app:mounted': async () => {
            await setupHtmlBranding();
            await setupWelcomeMessage();
            await import('#erudit/prose/global');
        },
    },
});
