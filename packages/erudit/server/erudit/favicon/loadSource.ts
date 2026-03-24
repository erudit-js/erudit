import { readFile } from 'node:fs/promises';
import { isAbsolute } from 'node:path';
import { imageSize } from 'image-size';
import { mimeFromExt } from './shared';

export interface FaviconSource {
  buffer: Buffer;
  mime: string;
  /** Undefined for SVG (treated as infinitely scalable) */
  width?: number;
  height?: number;
}

function mimeFromBuffer(buffer: Buffer): string | undefined {
  if (buffer.length < 12) return undefined;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
    return 'image/jpeg';

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  )
    return 'image/png';

  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46)
    return 'image/gif';

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  )
    return 'image/webp';

  if (buffer[0] === 0x42 && buffer[1] === 0x4d) return 'image/bmp';

  if (
    buffer[0] === 0x00 &&
    buffer[1] === 0x00 &&
    buffer[2] === 0x01 &&
    buffer[3] === 0x00
  )
    return 'image/x-icon';

  const head = buffer.subarray(0, 512).toString('utf-8').trim();
  if (head.startsWith('<svg') || head.startsWith('<?xml'))
    return 'image/svg+xml';

  return undefined;
}

function resolveMime(
  buffer: Buffer,
  href: string,
  serverMime?: string,
): string {
  return (
    mimeFromBuffer(buffer) ||
    mimeFromExt(href) ||
    (serverMime?.startsWith('image/') ? serverMime : undefined) ||
    'application/octet-stream'
  );
}

function detectDimensions(
  buffer: Buffer,
  mime: string,
): { width?: number; height?: number } {
  if (mime === 'image/svg+xml') return {};

  try {
    const size = imageSize(buffer);
    return { width: size.width, height: size.height };
  } catch {
    return {};
  }
}

function buildSource(buffer: Buffer, mime: string): FaviconSource {
  return { buffer, mime, ...detectDimensions(buffer, mime) };
}

const cache = new Map<string, FaviconSource | null>();

export async function loadFaviconSource(
  href: string,
): Promise<FaviconSource | undefined> {
  if (cache.has(href)) return cache.get(href) ?? undefined;

  const source = await doLoad(href);
  cache.set(href, source ?? null);
  return source;
}

async function doLoad(href: string): Promise<FaviconSource | undefined> {
  if (href.startsWith('http://') || href.startsWith('https://'))
    return loadFromUrl(href);

  return loadFromFilesystem(href);
}

async function loadFromUrl(url: string): Promise<FaviconSource | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;

    const buffer = Buffer.from(await response.arrayBuffer());
    const serverMime = (response.headers.get('content-type') || '')
      .split(';')[0]
      ?.trim();
    return buildSource(buffer, resolveMime(buffer, url, serverMime));
  } catch {
    return undefined;
  }
}

async function loadFromFilesystem(
  href: string,
): Promise<FaviconSource | undefined> {
  const cleanPath = href.replace(/^\.\//, '');
  const localPath = isAbsolute(cleanPath)
    ? cleanPath
    : ERUDIT.paths.project(cleanPath);

  try {
    const buffer = await readFile(localPath);
    return buildSource(buffer, resolveMime(buffer, href));
  } catch {
    return undefined;
  }
}
