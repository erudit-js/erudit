import { defineSchema, ensureTagNoChildren, type Schema } from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface HrSchema extends Schema {
  name: 'hr';
  type: 'block';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: undefined;
}

export const hrSchema = defineSchema<HrSchema>({
  name: 'hr',
  type: 'block',
  linkable: false,
});

export const Hr = defineEruditTag({
  tagName: 'Hr',
  schema: hrSchema,
})(({ tagName, children }) => {
  ensureTagNoChildren(tagName, children);
});

export default defineProseCoreElement({
  schema: hrSchema,
  tags: [Hr],
});
