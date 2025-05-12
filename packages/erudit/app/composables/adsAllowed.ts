import eruditConfig from '#erudit/config';

export function adsAllowed() {
    if (typeof eruditConfig?.debug?.ads === 'undefined') {
        return false;
    } else if (!Boolean(eruditConfig?.debug?.ads)) {
        return false;
    }

    return true;
}
