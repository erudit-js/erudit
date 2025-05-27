let alreadyPrerendered = false;
let isPrerendering = false;

export default defineNuxtPlugin({
    name: 'erudit-prerender',
    async setup(_nuxt) {
        if (import.meta.dev) {
            return; // Server is available so no need to prerender in dev mode
        }

        if (alreadyPrerendered || isPrerendering) {
            return;
        }

        isPrerendering = true;

        const routeProviders = [
            '/api/prerender/language',
            '/api/prerender/cameos',
            '/api/prerender/assets/cameo',
        ];

        for (const provider of routeProviders) {
            const routes = await $fetch<string[]>(provider);
            _nuxt.runWithContext(() => prerenderRoutes(routes));
        }

        alreadyPrerendered = true;
    },
});
