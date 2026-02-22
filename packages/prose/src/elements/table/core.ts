import {
  defineSchema,
  ensureTagChildren,
  ensureTagInlinerChildren,
  type InlinerSchema,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { captionSchema, type CaptionSchema } from '../caption/core.js';
import { defineProseCoreElements } from '../../coreElement.js';

//
// Table Data
//

export interface TableDataSchema extends Schema {
  name: 'tableData';
  type: 'inliner';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: InlinerSchema[];
}

export const tableDataSchema = defineSchema<TableDataSchema>({
  name: 'tableData',
  type: 'inliner',
  linkable: false,
});

export const Td = defineEruditTag({
  tagName: 'Td',
  schema: tableDataSchema,
})(({ element, children, tagName }) => {
  ensureTagInlinerChildren(tagName, children);
  element.children = children;
});

//
// Table Row
//

export interface TableRowSchema extends Schema {
  name: 'tableRow';
  type: 'inliner';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: TableDataSchema[];
}

export const tableRowSchema = defineSchema<TableRowSchema>({
  name: 'tableRow',
  type: 'inliner',
  linkable: false,
});

export const Tr = defineEruditTag({
  tagName: 'Tr',
  schema: tableRowSchema,
})(({ element, children, tagName }) => {
  ensureTagChildren(tagName, children, tableDataSchema);
  element.children = children;
});

//
// Table
//

export interface TableSchema extends Schema {
  name: 'table';
  type: 'block';
  linkable: true;
  Data: undefined;
  Storage: undefined;
  Children: (TableRowSchema | CaptionSchema)[];
}

export const tableSchema = defineSchema<TableSchema>({
  name: 'table',
  type: 'block',
  linkable: true,
});

export const Table = defineEruditTag({
  tagName: 'Table',
  schema: tableSchema,
})(({ element, children, tagName }) => {
  ensureTagChildren(tagName, children, [tableRowSchema, captionSchema]);
  element.children = children;
});

//
// Core Elements
//

export default defineProseCoreElements(
  {
    schema: tableDataSchema,
    tags: [Td],
  },
  {
    schema: tableRowSchema,
    tags: [Tr],
  },
  {
    schema: tableSchema,
    tags: [Table],
  },
);
