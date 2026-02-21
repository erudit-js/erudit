import { describe, expect, it } from 'vitest';
import { isRawElement } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import {
  type GallerySchema,
  Gallery,
  gallerySchema,
} from '@src/elements/gallery/core';
import { Image, imageSchema } from '@src/elements/image/core';
import { Caption, captionSchema } from '@src/elements/caption/core';

describe('Gallery', () => {
  it('should create gallery correctly', () => {
    const gallery = asEruditRaw<GallerySchema>(
      <Gallery>
        <Image src="image1.jpg" />
        <Image src="image2.jpg">
          <Caption>Image 2 Caption</Caption>
        </Image>
      </Gallery>,
    );

    expect(isRawElement(gallery, gallerySchema)).toBe(true);
    expect(gallery.children).toHaveLength(2);
    expect(isRawElement(gallery.children![0], imageSchema)).toBe(true);
    expect(isRawElement(gallery.children![1], imageSchema)).toBe(true);
    expect(gallery.children![1].children).toHaveLength(1);
    expect(isRawElement(gallery.children![1].children![0], captionSchema)).toBe(
      true,
    );
  });

  it('should throw when wrong children are provided', () => {
    // Not image child
    expect(() => (
      <Gallery>
        <Caption>Only Caption</Caption>
      </Gallery>
    )).toThrow();
  });
});
