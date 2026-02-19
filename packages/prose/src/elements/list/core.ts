import type { XOR } from 'ts-xor';
import {
  defineSchema,
  ensureTagBlockChildren,
  ensureTagChildren,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { paragraphWrap } from '../../shared/paragraphWrap.js';
import { defineProseCoreElements } from '../../coreElement.js';

//
// List Item
//

export interface ListItemSchema extends Schema {
  name: 'listItem';
  type: 'block';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: Schema[];
}

export const listItemSchema = defineSchema<ListItemSchema>({
  name: 'listItem',
  type: 'block',
  linkable: false,
});

export const Li = defineEruditTag({
  tagName: 'Li',
  schema: listItemSchema,
})(({ tagName, element, children }) => {
  const wrap = paragraphWrap(children);
  if (wrap) {
    element.children = wrap;
  } else {
    ensureTagBlockChildren(tagName, children);
    element.children = children;
  }
});

//
// List
//

export interface ListSchema extends Schema {
  name: 'list';
  type: 'block';
  linkable: true;
  Data: UnorderedListData | OrderedListData;
  Storage: undefined;
  Children: ListItemSchema[];
}

export interface UnorderedListData {
  type: 'unordered';
}

export interface OrderedListData {
  type: 'ordered';
  start?: number;
}

export const listSchema = defineSchema<ListSchema>({
  name: 'list',
  type: 'block',
  linkable: true,
});

export const List = defineEruditTag({
  tagName: 'List',
  schema: listSchema,
})<XOR<{ ordered: true; start?: number }, { unordered: true }>>(({
  element,
  tagName,
  props,
  children,
}) => {
  ensureTagChildren(tagName, children, listItemSchema);
  element.children = children;

  if ('ordered' in props) {
    element.data = {
      type: 'ordered',
      start: 'start' in props ? props.start : 1,
    };
  } else {
    element.data = { type: 'unordered' };
  }
});

//
// Core Elements
//

export default defineProseCoreElements(
  {
    schema: listItemSchema,
    tags: [Li],
  },
  {
    schema: listSchema,
    tags: [List],
  },
);
