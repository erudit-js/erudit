import {
  defineSchema,
  ensureTagBlockChildren,
  type BlockSchema,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface FlexSchema extends Schema {
  name: 'flex';
  type: 'block';
  linkable: true;
  Data: FlexData | undefined;
  Storage: undefined;
  Children: BlockSchema[];
}

export interface FlexData {
  gap?: string;
  justifyContent?: string;
  flexes?: string[];
}

export const flexSchema = defineSchema<FlexSchema>({
  name: 'flex',
  type: 'block',
  linkable: true,
});

export const Flex = defineEruditTag({
  tagName: 'Flex',
  schema: flexSchema,
})<{ gap?: string; justify?: string; flexes?: string[] }>(({
  element,
  tagName,
  children,
  props,
}) => {
  ensureTagBlockChildren(tagName, children);
  element.children = children;

  if (props.gap) {
    element.data = element.data || {};
    element.data.gap = props.gap;
  }

  if (props.justify) {
    element.data = element.data || {};
    element.data.justifyContent = props.justify;
  }

  if (props.flexes) {
    element.data = element.data || {};
    element.data.flexes = props.flexes;
  }
});

export default defineProseCoreElement({
  schema: flexSchema,
  tags: [Flex],
});
