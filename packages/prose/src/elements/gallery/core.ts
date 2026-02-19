import { defineSchema, ensureTagChildren, type Schema } from 'tsprose';

import { imageSchema } from '../image/core.js';
import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface GallerySchema extends Schema {
  name: 'gallery';
  type: 'block';
  linkable: true;
  Data: undefined;
  Storage: undefined;
  Children: (typeof imageSchema)[];
}

export const gallerySchema = defineSchema<GallerySchema>({
  name: 'gallery',
  type: 'block',
  linkable: true,
});

export const Gallery = defineEruditTag({
  tagName: 'Gallery',
  schema: gallerySchema,
})(({ element, tagName, children }) => {
  ensureTagChildren(tagName, children, imageSchema);
  element.children = children;
});

export default defineProseCoreElement({
  schema: gallerySchema,
  tags: [Gallery],
});
