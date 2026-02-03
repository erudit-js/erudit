import { sn } from 'unslash';

export function useBaseUrl() {
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.app.baseURL;

  return (path: string): string => {
    if (path.startsWith('/')) {
      return `${baseUrl}${path.slice(1)}`;
    }

    return path;
  };
}

export function useSiteUrl() {
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig.public.siteUrl;

  return (path?: string): string => {
    // Return external URLs as is
    if (path) {
      if (!path.startsWith('/')) {
        return path;
      }
    }

    return sn(siteUrl, path || '');
  };
}
