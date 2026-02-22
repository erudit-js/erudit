import {
  defineSchema,
  ensureTagInlinerChildren,
  type InlinerSchema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';

export type EmphasisData =
  | {
      type: 'italic';
    }
  | {
      type: 'bold';
      accent?: boolean;
    };

export interface EmphasisSchema extends InlinerSchema {
  name: 'emphasis';
  type: 'inliner';
  linkable: true;
  Data: EmphasisData;
  Storage: undefined;
  Children: InlinerSchema[];
}

export const emphasisSchema = defineSchema<EmphasisSchema>({
  name: 'emphasis',
  type: 'inliner',
  linkable: true,
});

export const B = defineEruditTag({
  tagName: 'B',
  schema: emphasisSchema,
})<{ accent?: boolean }>(({ element, tagName, props, children }) => {
  ensureTagInlinerChildren(tagName, children);
  element.children = children;
  element.data = { type: 'bold' };

  if (props.accent === true) {
    element.data.accent = true;
  }
});

export const I = defineEruditTag({
  tagName: 'I',
  schema: emphasisSchema,
})(({ element, tagName, children }) => {
  ensureTagInlinerChildren(tagName, children);
  element.children = children;
  element.data = { type: 'italic' };
});

export default defineProseCoreElement({
  schema: emphasisSchema,
  tags: [B, I],
});
