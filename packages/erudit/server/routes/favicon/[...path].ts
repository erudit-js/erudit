import { loadFaviconSource } from '#layers/erudit/server/erudit/favicon/loadSource';
import { convertFaviconToPng } from '#layers/erudit/server/erudit/favicon/convertToPng';
import {
  FAVICON_SIZES,
  FAVICON_KEYS,
  getFaviconHref,
  type FaviconSize,
  type FaviconKey,
} from '#layers/erudit/server/erudit/favicon/shared';

export default defineEventHandler(async (event) => {
  const rawPath = event.context.params?.path;
  if (!rawPath) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid favicon path',
    });
  }

  const slashIdx = rawPath.indexOf('/');
  if (slashIdx === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid favicon path',
    });
  }

  const key = rawPath.slice(0, slashIdx);
  const file = rawPath.slice(slashIdx + 1);

  if (!FAVICON_KEYS.includes(key as FaviconKey)) {
    throw createError({
      statusCode: 404,
      statusMessage: `Unknown favicon key: ${key}`,
    });
  }

  const href = getFaviconHref(key);
  if (!href) {
    throw createError({
      statusCode: 404,
      statusMessage: `No favicon configured for: ${key}`,
    });
  }

  const source = await loadFaviconSource(href);
  if (!source) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Failed to load favicon source',
    });
  }

  // Source route: {key}/source.{ext}
  if (file.startsWith('source.')) {
    setHeader(event, 'Content-Type', source.mime);
    setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return source.buffer;
  }

  // PNG route: {key}/{size}.png
  if (!file.endsWith('.png')) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid favicon path',
    });
  }

  const size = Number(file.slice(0, -4)) as FaviconSize;

  if (!FAVICON_SIZES.includes(size)) {
    throw createError({
      statusCode: 404,
      statusMessage: `Invalid favicon size: ${file}`,
    });
  }

  if (source.width !== undefined && source.width < size) {
    throw createError({
      statusCode: 404,
      statusMessage: `Favicon source too small (${source.width}px) for size ${size}px`,
    });
  }

  const png = await convertFaviconToPng(key, source, size);
  setHeader(event, 'Content-Type', 'image/png');
  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return png;
});
