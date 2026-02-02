import {
  defineRegistryItem,
  defineSchema,
  ensureTagInlinerChildren,
  isRawElement,
  ProseError,
  type InlinerSchema,
  type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElements } from '../../coreElement.js';

//
// Caption Secondary
//

export const captionSecondarySchema = defineSchema({
  name: 'captionSecondary',
  type: 'inliner',
  linkable: false,
})<{
  Data: undefined;
  Storage: undefined;
  Children: InlinerSchema[];
}>();

export const CaptionSecondary = defineEruditTag({
  tagName: 'CaptionSecondary',
  schema: captionSecondarySchema,
})<TagChildren>(({ element, tagName, children, registry }) => {
  ensureTagInlinerChildren(tagName, children, registry);
  element.children = children;
});

export const captionSecondaryRegistryItem = defineRegistryItem({
  schema: captionSecondarySchema,
  tags: [CaptionSecondary],
});

//
// Caption
//

export interface CaptionData {
  width?: string;
}

export const captionSchema = defineSchema({
  name: 'caption',
  type: 'inliner',
  linkable: false,
})<{
  Data: CaptionData | undefined;
  Storage: undefined;
  Children: InlinerSchema[];
}>();

export const Caption = defineEruditTag({
  tagName: 'Caption',
  schema: captionSchema,
})<{ width?: string } & TagChildren>(({
  tagName,
  element,
  props,
  children,
  registry,
}) => {
  ensureTagInlinerChildren(tagName, children, registry);

  let containsNonSecondary = false;
  let containsSecondary = false;

  for (const child of children) {
    if (isRawElement(child, captionSecondarySchema)) {
      if (containsSecondary) {
        throw new ProseError(
          `Duplicate <${CaptionSecondary.tagName}> detected!`,
        );
      }
      containsSecondary = true;
    } else {
      containsNonSecondary = true;
    }
  }

  if (containsSecondary && !containsNonSecondary) {
    throw new ProseError(
      `Cannot have a <${CaptionSecondary.tagName}> without a main caption content!`,
    );
  }

  element.children = children;

  if (props.width) {
    element.data = element.data || {};
    element.data.width = props.width;
  }
});

export const captionRegistryItem = defineRegistryItem({
  schema: captionSchema,
  tags: [Caption],
});

//
// Erudit Core Elements
//

export default defineEruditProseCoreElements(
  { registryItem: captionRegistryItem },
  { registryItem: captionSecondaryRegistryItem },
);
