import eruditConfig from '#erudit/config';

export const defaultFavicon =
    eruditConfig.site?.favicon?.default || eruditAsset('favicon/default.svg');

export function useFavicon() {
    return useState('favicon', () => defaultFavicon);
}
