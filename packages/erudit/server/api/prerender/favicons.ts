import { loadFaviconSource } from '#layers/erudit/server/erudit/favicon/loadSource';
import {
  FAVICON_KEYS,
  FAVICON_SIZES,
  getFaviconHref,
  extFromHref,
} from '#layers/erudit/server/erudit/favicon/shared';

export default defineEventHandler(async () => {
  const routes: string[] = [];

  for (const key of FAVICON_KEYS) {
    const href = getFaviconHref(key);
    if (!href) continue;

    const source = await loadFaviconSource(href);
    if (!source) continue;

    const ext = extFromHref(href);
    if (ext) {
      routes.push(`/favicon/${key}/source${ext}`);
    }

    for (const size of FAVICON_SIZES) {
      if (source.width !== undefined && source.width < size) continue;
      routes.push(`/favicon/${key}/${size}.png`);
    }
  }

  return routes;
});
