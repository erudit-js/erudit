let alreadyPrerendered = false;
let isPrerendering = false;

export default defineNuxtPlugin({
    name: 'erudit-prerender-routes',
    async setup(nuxt) {
        if (import.meta.dev) {
            // Server is available so no need to prerender anything
            return;
        }

        if (alreadyPrerendered || isPrerendering) {
            return;
        }

        isPrerendering = true;

        const routes = ['/robots.txt', '/search.json.gz'];

        const routeProviders = [
            '/api/prerender/contributors',
            '/api/prerender/language',
        ];

        for (const provider of routeProviders) {
            const fetchedRoutes = await $fetch<string[]>(provider);
            routes.push(...fetchedRoutes);
        }

        nuxt.runWithContext(() => prerenderRoutes(routes));

        alreadyPrerendered = true;
        isPrerendering = false;
    },
});
