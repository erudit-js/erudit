import type { XOR } from 'ts-xor';
import {
  defineRegistryItem,
  defineSchema,
  ensureTagChildren,
  type AnySchema,
  type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElements } from '../../coreElement.js';
import { tryParagraphWrap } from '../../shared/paragraphWrap.js';

export const listItemSchema = defineSchema({
  name: 'listItem',
  type: 'block',
  linkable: false,
})<{
  Data: undefined;
  Storage: undefined;
  Children: AnySchema[];
}>();

export const Li = defineEruditTag({
  tagName: 'Li',
  schema: listItemSchema,
})<TagChildren>(({ tagName, element, children }) => {
  ensureTagChildren(tagName, children);
  element.children = children;

  const paragraphWrap = tryParagraphWrap(children);
  if (paragraphWrap) {
    element.children = paragraphWrap;
  }
});

export interface UlListData {
  type: 'ul';
}

export interface OlListData {
  type: 'ol';
  start?: number;
}

export const listSchema = defineSchema({
  name: 'list',
  type: 'block',
  linkable: true,
})<{
  Data: UlListData | OlListData;
  Storage: undefined;
  Children: (typeof listItemSchema)[];
}>();

export const List = defineEruditTag({
  tagName: 'List',
  schema: listSchema,
})<XOR<{ ordered: true; start?: number }, { unordered: true }> & TagChildren>(({
  element,
  tagName,
  props,
  children,
}) => {
  ensureTagChildren(tagName, children, listItemSchema);
  element.children = children;

  if ('ordered' in props) {
    element.data = { type: 'ol', start: 'start' in props ? props.start : 1 };
  } else {
    element.data = { type: 'ul' };
  }
});

export const listItemRegistryItem = defineRegistryItem({
  schema: listItemSchema,
  tags: [Li],
});

export const listRegistryItem = defineRegistryItem({
  schema: listSchema,
  tags: [List],
});

export default defineEruditProseCoreElements(
  { registryItem: listItemRegistryItem },
  { registryItem: listRegistryItem },
);
