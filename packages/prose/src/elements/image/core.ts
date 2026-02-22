import { defineSchema, ensureTagChildren, type Schema } from 'tsprose';

import { captionSchema } from '../caption/core.js';
import { defineEruditTag } from '../../tag.js';
import { photoswipeDependency } from '../../shared/photoswipe.js';
import type { Invert } from '../../shared/invert.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface ImageSchema extends Schema {
  name: 'image';
  type: 'block';
  linkable: true;
  Data: ImageData;
  Storage: ImageStorage;
  Children: [typeof captionSchema] | undefined;
}

export interface ImageData {
  src: string;
  invert?: Invert;
  width?: string;
}

export interface ImageStorage {
  resolvedSrc: string;
  width: number;
  height: number;
}

export const imageSchema = defineSchema<ImageSchema>({
  name: 'image',
  type: 'block',
  linkable: true,
});

export const Image = defineEruditTag({
  tagName: 'Image',
  schema: imageSchema,
})<{ src: string; invert?: Invert; width?: string; children?: {} }>(({
  element,
  tagName,
  props,
  children,
}) => {
  if (children) {
    ensureTagChildren(tagName, children, captionSchema);
    element.children = [children[0]];
  }

  element.data = {
    src: props.src,
  };

  element.storageKey = props.src;

  if (props.width) {
    element.data.width = props.width;
  }

  if (props.invert) {
    element.data.invert = props.invert;
  }
});

export default defineProseCoreElement({
  schema: imageSchema,
  tags: [Image],
  rawToProseHook: ({ result }) => {
    return {
      matchStep: ({ rawElement }) => {
        result.files.add(rawElement.data.src);
      },
    };
  },
  dependencies: {
    ...photoswipeDependency,
  },
});
