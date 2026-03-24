import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import type { FaviconSource } from './loadSource';

const cache = new Map<string, Buffer>();

export async function convertFaviconToPng(
  faviconKey: string,
  source: FaviconSource,
  size: number,
): Promise<Buffer> {
  const cacheKey = `${faviconKey}:${size}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const png =
    source.mime === 'image/svg+xml'
      ? await svgToPng(source.buffer, size)
      : await rasterToPng(source.buffer, size);

  cache.set(cacheKey, png);
  return png;
}

async function svgToPng(svgBuffer: Buffer, size: number): Promise<Buffer> {
  const resvg = new Resvg(svgBuffer.toString('utf-8'), {
    fitTo: { mode: 'width', value: size },
  });
  const rendered = Buffer.from(resvg.render().asPng());

  return sharp(rendered)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function rasterToPng(buffer: Buffer, size: number): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}
