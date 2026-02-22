import {
  defineSchema,
  ensureTagInlinerChildren,
  type InlinerSchema,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface ParagraphSchema extends Schema {
  name: 'paragraph';
  type: 'block';
  linkable: true;
  Data: ParagraphData;
  Storage: undefined;
  Children: InlinerSchema[];
}

export const paragraphSchema = defineSchema<ParagraphSchema>({
  name: 'paragraph',
  type: 'block',
  linkable: true,
});

export type ParagraphData =
  | undefined
  | {
      center?: boolean;
      serif?: boolean;
    };

export const P = defineEruditTag({
  tagName: 'P',
  schema: paragraphSchema,
})<{ center?: true; serif?: true }>(({ element, tagName, props, children }) => {
  ensureTagInlinerChildren(tagName, children);
  element.children = children;

  if (props.center || props.serif) {
    element.data = {};
    if (props.center) {
      element.data.center = true;
    }
    if (props.serif) {
      element.data.serif = true;
    }
  }
});

export default defineProseCoreElement({
  schema: paragraphSchema,
  tags: [P],
});
