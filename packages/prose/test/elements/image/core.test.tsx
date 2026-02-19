import { describe, expect, it } from 'vitest';
import { isRawElement } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import core, {
  Image,
  imageSchema,
  type ImageSchema,
} from '@src/elements/image/core';
import { Caption, captionSchema } from '@src/elements/caption/core';
import { eruditRawToProse } from '@src/rawToProse';

describe('Image', () => {
  it('should create image correctly', () => {
    const image = asEruditRaw<ImageSchema>(
      <Image src="image.png" width="600px" invert="dark">
        <Caption>Image Caption</Caption>
      </Image>,
    );

    expect(isRawElement(image, imageSchema)).toBe(true);
    expect(image.data).toEqual({
      invert: 'dark',
      src: 'image.png',
      width: '600px',
    });
    expect(image.storageKey).toBe('image.png');
    expect(image.children).toHaveLength(1);
    expect(isRawElement(image.children![0], captionSchema)).toBe(true);

    expect(() => <Image src="image.png" />).not.toThrow();
  });

  it('should throw when wrong children are provided', () => {
    // Not caption child
    expect(() => <Image src="image.png">Only Content</Image>).toThrow();
  });
});

describe('rawToProseHook', () => {
  it('should add image src to files', async () => {
    const { files } = await eruditRawToProse(
      {
        schemaHooks: new Map([[imageSchema, core.rawToProseHook]]),
      },
      <Image src="image.png" />,
    );

    expect(files.has('image.png')).toBe(true);
  });
});
