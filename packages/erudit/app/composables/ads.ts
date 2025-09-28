export function adsAllowed() {
    if (ERUDIT.config.project.ads === undefined) {
        return import.meta.dev ? false : true;
    } else if (!Boolean(ERUDIT.config.project.debug.ads)) {
        return false;
    }

    return true;
}

export function adsAsideAllowed() {
    return adsAllowed() && Boolean(ERUDIT.config.project.ads?.aside);
}

export function adsBottomAllowed() {
    return adsAllowed() && Boolean(ERUDIT.config.project.ads?.bottom);
}
