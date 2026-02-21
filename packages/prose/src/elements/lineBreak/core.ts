import { defineSchema, ensureTagNoChildren, type Schema } from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface BrSchema extends Schema {
  name: 'br';
  type: 'inliner';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: undefined;
}

export const brSchema = defineSchema<BrSchema>({
  name: 'br',
  type: 'inliner',
  linkable: false,
});

export const Br = defineEruditTag({
  tagName: 'Br',
  schema: brSchema,
})(({ tagName, children }) => {
  ensureTagNoChildren(tagName, children);
});

export default defineProseCoreElement({
  schema: brSchema,
  tags: [Br],
});
