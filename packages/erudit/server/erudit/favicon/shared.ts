export const FAVICON_SIZES = [32, 48, 180] as const;
export type FaviconSize = (typeof FAVICON_SIZES)[number];

// Mirrors contentTypes (minus 'topic') + topicParts from @erudit-js/core
export const FAVICON_KEYS = [
  'default',
  'book',
  'group',
  'page',
  'article',
  'summary',
  'practice',
] as const;
export type FaviconKey = (typeof FAVICON_KEYS)[number];

function fallbackFaviconPath(): string {
  return ERUDIT.paths.erudit('public', 'favicons', 'default.svg');
}

export function getFaviconHref(key: string): string | undefined {
  const href = (
    ERUDIT.config.public.favicon as Record<string, string> | undefined
  )?.[key];
  if (href) return href;
  if (key === 'default') return fallbackFaviconPath();
  return undefined;
}

const mimeByExt: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
};

export function extFromHref(href: string): string {
  const path = href.split(/[?#]/)[0] ?? '';
  const dot = path.lastIndexOf('.');
  return dot === -1 ? '' : path.slice(dot).toLowerCase();
}

export function mimeFromExt(href: string): string | undefined {
  return mimeByExt[extFromHref(href)];
}
