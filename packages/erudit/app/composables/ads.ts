export function adsAllowed() {
  const debugAllowed = ERUDIT.config.debug?.ads;

  if (debugAllowed === true) {
    return true;
  }

  const adsConfig = ERUDIT.config.ads;

  if (adsConfig === undefined) {
    return false;
  }

  return ERUDIT.config.mode === 'static';
}

export function adsAsideAllowed() {
  return adsAllowed() && Boolean(ERUDIT.config.ads?.aside);
}

export function adsBottomAllowed() {
  return adsAllowed() && Boolean(ERUDIT.config.ads?.bottom);
}
