export function adsAllowed() {
    const debugAllowed = ERUDIT.config.project.debug?.ads;

    if (debugAllowed === true) {
        return true;
    }

    const adsConfig = ERUDIT.config.project.ads;

    if (adsConfig === undefined) {
        return false;
    }

    return ERUDIT.config.mode === 'generate';
}

export function adsAsideAllowed() {
    return adsAllowed() && Boolean(ERUDIT.config.project.ads?.aside);
}

export function adsBottomAllowed() {
    return adsAllowed() && Boolean(ERUDIT.config.project.ads?.bottom);
}
