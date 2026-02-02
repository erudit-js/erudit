import {
  defineRegistryItem,
  defineSchema,
  ensureTagBlockChildren,
  type BlockSchema,
  type TagChildren,
} from '@jsprose/core';
import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';

export interface FlexData {
  gap?: string;
  justifyContent?: string;
  flexes?: string[];
}

export const flexSchema = defineSchema({
  name: 'flex',
  type: 'block',
  linkable: true,
})<{
  Data: FlexData | undefined;
  Storage: undefined;
  Children: BlockSchema[];
}>();

export const Flex = defineEruditTag({
  tagName: 'Flex',
  schema: flexSchema,
})<{ gap?: string; justify?: string; flexes?: string[] } & TagChildren>(({
  element,
  tagName,
  children,
  props,
  registry,
}) => {
  ensureTagBlockChildren(tagName, children, registry);
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

export const flexRegistryItem = defineRegistryItem({
  schema: flexSchema,
  tags: [Flex],
});

export default defineEruditProseCoreElement({
  registryItem: flexRegistryItem,
});
