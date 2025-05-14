import eruditConfig from '#erudit/config';

export function adsAllowed() {
    if (typeof eruditConfig?.debug?.ads === 'undefined') {
        return import.meta.dev ? false : true;
    } else if (!Boolean(eruditConfig?.debug?.ads)) {
        return false;
    }

    return true;
}
