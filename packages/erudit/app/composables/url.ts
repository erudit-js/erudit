import eruditConfig from '#erudit/config';
import { trailingSlash, normalizeUrl } from '@erudit/utils/url';

export function useBaseUrlPath() {
    const runtimeConfig = useRuntimeConfig();
    const baseURL = runtimeConfig.app.baseURL;

    return (path: string) => {
        const normalizedPath = normalizeUrl(path);

        if (normalizedPath.startsWith(baseURL)) {
            return normalizedPath;
        }

        if (normalizedPath.startsWith('/')) {
            return normalizeUrl(baseURL + normalizedPath.substring(1));
        }

        return normalizedPath;
    };
}

export function useSiteUrl() {
    const runtimeConfig = useRuntimeConfig();
    const baseUrl = runtimeConfig.app.baseURL;
    const url = useRequestURL();

    if (!import.meta.dev && eruditConfig.site?.buildUrl)
        return eruditConfig.site.buildUrl + baseUrl.slice(0, -1);

    return normalizeUrl(trailingSlash(url.origin, true));
}

export function usePageUrl() {
    const siteUrl = useSiteUrl();
    const route = useRoute();

    return computed(() => {
        if (route.path === '/') return siteUrl;
        const fullUrl = siteUrl + route.path;
        return normalizeUrl(trailingSlash(fullUrl, true));
    });
}
