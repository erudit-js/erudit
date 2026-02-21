import { defineSchema, ensureTagChildren, type Schema } from 'tsprose';

import type { Invert } from '../../shared/invert.js';
import { captionSchema } from '../caption/core.js';
import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface VideoSchema extends Schema {
  name: 'video';
  type: 'block';
  linkable: true;
  Data: VideoData;
  Storage: VideoStorage;
  Children: [typeof captionSchema] | undefined;
}

export interface VideoData {
  src: string;
  autoplay?: boolean;
  invert?: Invert;
  width?: string;
}

export interface VideoStorage {
  resolvedSrc: string;
}

export const videoSchema = defineSchema<VideoSchema>({
  name: 'video',
  type: 'block',
  linkable: true,
});

export const Video = defineEruditTag({
  tagName: 'Video',
  schema: videoSchema,
})<{
  src: string;
  autoplay?: boolean;
  invert?: Invert;
  width?: string;
  children?: {};
}>(({ element, tagName, props, children }) => {
  if (children) {
    ensureTagChildren(tagName, children, captionSchema);
    element.children = [children[0]];
  }

  element.data = {
    src: props.src,
  };

  element.storageKey = props.src;

  if (props.autoplay !== undefined) {
    element.data.autoplay = props.autoplay;
  }

  if (props.width) {
    element.data.width = props.width;
  }

  if (props.invert) {
    element.data.invert = props.invert;
  }
});

export default defineProseCoreElement({
  schema: videoSchema,
  tags: [Video],
  rawToProseHook: ({ result }) => {
    return {
      matchStep: ({ rawElement }) => {
        result.files.add(rawElement.data.src);
      },
    };
  },
});
