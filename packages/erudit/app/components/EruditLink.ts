export default defineNuxtLink({
    componentName: 'EruditLink',
    trailingSlash: 'append',
    prefetch: true,
    prefetchOn: {
        visibility: false,
        interaction: true,
    },
});
