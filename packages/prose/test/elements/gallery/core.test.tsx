import { describe, expect, it } from 'vitest';
import { isRawElement, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
  Image,
  imageRegistryItem,
  imageSchema,
} from '@erudit-js/prose/elements/image/core';
import {
  Caption,
  captionRegistryItem,
  captionSchema,
} from '@erudit-js/prose/elements/caption/core';
import {
  Gallery,
  galleryRegistryItem,
  gallerySchema,
} from '@erudit-js/prose/elements/gallery/core';

const prepareRegistry = () =>
  PROSE_REGISTRY.setItems(
    galleryRegistryItem,
    imageRegistryItem,
    captionRegistryItem,
  );

describe('Gallery', () => {
  it('should create gallery correctly', () => {
    prepareRegistry();

    const gallery = asEruditRaw(
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
    prepareRegistry();

    // Not image child
    expect(() => (
      <Gallery>
        <Caption>Only Caption</Caption>
      </Gallery>
    )).toThrow();
  });
});
