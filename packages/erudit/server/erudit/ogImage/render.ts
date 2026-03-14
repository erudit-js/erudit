import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { type SatoriNode, OG_WIDTH, OG_HEIGHT } from './shared';

let regularFontData: ArrayBuffer | undefined;
let boldFontData: ArrayBuffer | undefined;

function loadFontFile(filename: string): ArrayBuffer {
  const fontPath = ERUDIT.paths.erudit('server/erudit/ogImage/fonts', filename);
  const buffer = readFileSync(fontPath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

function loadFonts(): { regular: ArrayBuffer; bold: ArrayBuffer } {
  if (!regularFontData) {
    regularFontData = loadFontFile('NotoSans-Regular.ttf');
  }
  if (!boldFontData) {
    boldFontData = loadFontFile('NotoSans-Bold.ttf');
  }
  return { regular: regularFontData, bold: boldFontData };
}

const CACHE_CAPACITY = 50;
const cacheSlotKeys: (string | undefined)[] = new Array(CACHE_CAPACITY);
const cacheSlotValues: (Buffer | undefined)[] = new Array(CACHE_CAPACITY);
const cacheKeyToSlot = new Map<string, number>();
let cachePointer = 0;

export async function renderOgImage(
  cacheKey: string,
  template: SatoriNode,
): Promise<Buffer> {
  const slot = cacheKeyToSlot.get(cacheKey);
  if (slot !== undefined) return cacheSlotValues[slot]!;

  const fonts = loadFonts();

  const svg = await satori(template as any, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      {
        name: 'Noto Sans',
        data: fonts.regular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Noto Sans',
        data: fonts.bold,
        weight: 600,
        style: 'normal',
      },
      {
        name: 'Noto Sans',
        data: fonts.bold,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: OG_WIDTH,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = Buffer.from(pngData.asPng());

  // Evict oldest entry when the circular buffer is full
  const evictedKey = cacheSlotKeys[cachePointer];
  if (evictedKey !== undefined) {
    cacheKeyToSlot.delete(evictedKey);
  }

  cacheSlotKeys[cachePointer] = cacheKey;
  cacheSlotValues[cachePointer] = pngBuffer;
  cacheKeyToSlot.set(cacheKey, cachePointer);
  cachePointer = (cachePointer + 1) % CACHE_CAPACITY;

  return pngBuffer;
}
