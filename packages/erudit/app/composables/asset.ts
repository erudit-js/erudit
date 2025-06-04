/**
 * @param path Path relative to `PROJECT_DIR`
 */
export function useAssetRoute() {
    const useBaseUrl = useBaseUrlPath();
    return (path: string) => {
        if (!path.startsWith('/asset/')) {
            path = '/asset/' + path.replace(/^\/+/, '');
        }
        return useBaseUrl(path);
    };
}
