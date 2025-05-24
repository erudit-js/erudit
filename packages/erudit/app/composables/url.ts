import eruditConfig from '#erudit/config';
import { trailingSlash } from '@erudit/utils/slash';

export function useBaseUrlPath() {
    const runtimeConfig = useRuntimeConfig();
    return (path: string) => {
        const baseURL = runtimeConfig.app.baseURL;
        if (path.startsWith(baseURL)) return path;
        else if (path.startsWith('/')) return baseURL + path.substring(1);
        else return path;
    };
}

export function useSiteUrl() {
    const runtimeConfig = useRuntimeConfig();
    const baseUrl = runtimeConfig.app.baseURL;
    const url = useRequestURL();

    if (!import.meta.dev && eruditConfig.site?.buildUrl)
        return eruditConfig.site.buildUrl + baseUrl.slice(0, -1);

    return trailingSlash(url.origin, true);
}

export function usePageUrl() {
    const siteUrl = useSiteUrl();
    const route = useRoute();

    return computed(() => {
        if (route.path === '/') return siteUrl;

        return trailingSlash(siteUrl + route.path, true);
    });
}
