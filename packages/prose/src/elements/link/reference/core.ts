import { defineSchema, type RequiredChildren, type Schema } from 'tsprose';

import { handleLinkTag, type LinkData, type LinkToProp } from '../core.js';
import type { LinkStorage } from '../storage.js';
import { defineEruditTag } from '../../../tag.js';
import { defineProseCoreElements } from '../../../coreElement.js';
import type { NoSnippet } from '../../../snippet.js';
import type { NoToc } from '../../../toc.js';

export interface RefSchema extends Schema {
  name: 'referenceInliner';
  type: 'inliner';
  linkable: true;
  Data: LinkData;
  Storage: LinkStorage;
  Children: undefined;
}

export const refSchema = defineSchema<RefSchema>({
  name: 'referenceInliner',
  type: 'inliner',
  linkable: true,
});

export interface ReferenceSchema extends Schema {
  name: 'referenceBlock';
  type: 'block';
  linkable: true;
  Data: LinkData;
  Storage: LinkStorage;
  Children: undefined;
}

export const referenceSchema = defineSchema<ReferenceSchema>({
  name: 'referenceBlock',
  type: 'block',
  linkable: true,
});

export const Ref = defineEruditTag({
  tagName: 'Ref',
  schema: refSchema,
})<{ to: LinkToProp } & RequiredChildren & NoSnippet & NoToc>(({
  element,
  tagName,
  props,
  children,
}) => {
  handleLinkTag(element, tagName, props, children);
});

export const Reference = defineEruditTag({
  tagName: 'Reference',
  schema: referenceSchema,
})<{ to: Exclude<LinkToProp, string> } & RequiredChildren & NoSnippet & NoToc>(
  ({ element, tagName, props, children }) => {
    handleLinkTag(element, tagName, props, children);
  },
);

export default defineProseCoreElements(
  {
    schema: refSchema,
    tags: [Ref],
  },
  {
    schema: referenceSchema,
    tags: [Reference],
  },
);
