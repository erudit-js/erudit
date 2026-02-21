import {
  defineSchema,
  ensureTagInlinerChildren,
  isRawElement,
  type InlinerSchema,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { EruditProseError } from '../../error.js';
import { defineProseCoreElements } from '../../coreElement.js';

//
// Caption Secondary
//

export interface CaptionSecondarySchema extends Schema {
  name: 'captionSecondary';
  type: 'inliner';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: InlinerSchema[];
}

export const captionSecondarySchema = defineSchema<CaptionSecondarySchema>({
  name: 'captionSecondary',
  type: 'inliner',
  linkable: false,
});

export const CaptionSecondary = defineEruditTag({
  tagName: 'CaptionSecondary',
  schema: captionSecondarySchema,
})(({ element, tagName, children }) => {
  ensureTagInlinerChildren(tagName, children);
  element.children = children;
});

//
// Caption
//

export interface CaptionSchema extends Schema {
  name: 'caption';
  type: 'inliner';
  linkable: false;
  Data: CaptionData | undefined;
  Storage: undefined;
  Children: InlinerSchema[];
}

export interface CaptionData {
  width?: string;
}

export const captionSchema = defineSchema<CaptionSchema>({
  name: 'caption',
  type: 'inliner',
  linkable: false,
});

export const Caption = defineEruditTag({
  tagName: 'Caption',
  schema: captionSchema,
})<{ width?: string }>(({ tagName, element, props, children }) => {
  ensureTagInlinerChildren(tagName, children);

  let containsNonSecondary = false;
  let containsSecondary = false;

  for (const child of children) {
    if (isRawElement(child, captionSecondarySchema)) {
      if (containsSecondary) {
        throw new EruditProseError(
          `Duplicate <${CaptionSecondary.tagName}> detected!`,
        );
      }
      containsSecondary = true;
    } else {
      containsNonSecondary = true;
    }
  }

  if (containsSecondary && !containsNonSecondary) {
    throw new EruditProseError(
      `Cannot have a <${CaptionSecondary.tagName}> without a main caption content!`,
    );
  }

  element.children = children;

  if (props.width) {
    element.data = element.data || {};
    element.data.width = props.width;
  }
});

//
// Core Elements
//

export default defineProseCoreElements(
  {
    schema: captionSecondarySchema,
    tags: [CaptionSecondary],
  },
  {
    schema: captionSchema,
    tags: [Caption],
  },
);
