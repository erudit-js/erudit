import {
  defineRegistryItem,
  defineSchema,
  ensureTagChildren,
  ensureTagInlinerChildren,
  type InlinerSchema,
  type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { captionSchema } from '../caption/core.js';
import { defineEruditProseCoreElements } from '../../coreElement.js';

//
// Table Data
//

export const tableDataSchema = defineSchema({
  name: 'tableData',
  type: 'inliner',
  linkable: false,
})<{
  Data: undefined;
  Storage: undefined;
  Children: InlinerSchema[];
}>();

export const Td = defineEruditTag({
  tagName: 'Td',
  schema: tableDataSchema,
})<TagChildren>(({ element, children, tagName, registry }) => {
  ensureTagInlinerChildren(tagName, children, registry);
  element.children = children;
});

export const tableDataRegistryItem = defineRegistryItem({
  schema: tableDataSchema,
  tags: [Td],
});

//
// Table Row
//

export const tableRowSchema = defineSchema({
  name: 'tableRow',
  type: 'inliner',
  linkable: false,
})<{
  Data: undefined;
  Storage: undefined;
  Children: (typeof tableDataSchema)[];
}>();

export const Tr = defineEruditTag({
  tagName: 'Tr',
  schema: tableRowSchema,
})<TagChildren>(({ element, children, tagName }) => {
  ensureTagChildren(tagName, children, tableDataSchema);
  element.children = children;
});

export const tableRowRegistryItem = defineRegistryItem({
  schema: tableRowSchema,
  tags: [Tr],
});

//
// Table
//

export const tableSchema = defineSchema({
  name: 'table',
  type: 'block',
  linkable: true,
})<{
  Data: undefined;
  Storage: undefined;
  Children: (typeof tableRowSchema | typeof captionSchema)[];
}>();

export const Table = defineEruditTag({
  tagName: 'Table',
  schema: tableSchema,
})<TagChildren>(({ element, children, tagName }) => {
  ensureTagChildren(tagName, children, [tableRowSchema, captionSchema]);
  element.children = children;
});

export const tableRegistryItem = defineRegistryItem({
  schema: tableSchema,
  tags: [Table],
});

//
// Erudit Core Elements
//

export default defineEruditProseCoreElements(
  { registryItem: tableDataRegistryItem },
  { registryItem: tableRowRegistryItem },
  { registryItem: tableRegistryItem },
);
