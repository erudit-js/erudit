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

        const routesToPrerender = await $fetch<string[]>('/api/prerender');
        _nuxt.runWithContext(() => prerenderRoutes(routesToPrerender));

        alreadyPrerendered = true;
    },
});
