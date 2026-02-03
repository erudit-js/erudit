import {
  defineRegistryItem,
  defineSchema,
  ensureTagNoChildren,
  type NoTagChildren,
} from '@jsprose/core';

import { defineEruditProseCoreElement } from '../../coreElement.js';
import { defineEruditTag } from '../../tag.js';

export const brSchema = defineSchema({
  name: 'br',
  type: 'inliner',
  linkable: false,
})<{
  Data: undefined;
  Storage: undefined;
  Children: undefined;
}>();

export const Br = defineEruditTag({
  tagName: 'Br',
  schema: brSchema,
})<NoTagChildren>(({ tagName, children }) => {
  ensureTagNoChildren(tagName, children);
});

export const brRegistryItem = defineRegistryItem({
  schema: brSchema,
  tags: [Br],
});

export default defineEruditProseCoreElement({
  registryItem: brRegistryItem,
});
