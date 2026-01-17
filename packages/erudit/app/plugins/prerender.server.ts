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

        const routes = ['/robots.txt', '/search.json.gz', '/sitemap.xml'];

        const routeProviders = [
            '/api/prerender/default',
            '/api/prerender/files',
            '/api/prerender/frontNav',
            '/api/prerender/language',
            '/api/prerender/content',
            '/api/prerender/quotes',
            '/api/prerender/news',
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
