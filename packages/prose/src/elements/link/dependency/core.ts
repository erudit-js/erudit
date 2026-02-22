import { defineSchema, type RequiredChildren, type Schema } from 'tsprose';

import { handleLinkTag, type LinkData, type LinkToProp } from '../core.js';
import type { ExternalLinkStorage, LinkStorage } from '../storage.js';
import { defineEruditTag } from '../../../tag.js';
import type { NoSnippet } from '../../../snippet.js';
import type { NoToc } from '../../../toc.js';
import { defineProseCoreElements } from '../../../coreElement.js';

export interface DepSchema extends Schema {
  name: 'dependencyInliner';
  type: 'inliner';
  linkable: true;
  Data: LinkData;
  Storage: Exclude<LinkStorage, ExternalLinkStorage>;
  Children: undefined;
}

export const depSchema = defineSchema<DepSchema>({
  name: 'dependencyInliner',
  type: 'inliner',
  linkable: true,
});

export interface DependencySchema extends Schema {
  name: 'dependencyBlock';
  type: 'block';
  linkable: true;
  Data: LinkData;
  Storage: Exclude<LinkStorage, ExternalLinkStorage>;
  Children: undefined;
}

export const dependencySchema = defineSchema<DependencySchema>({
  name: 'dependencyBlock',
  type: 'block',
  linkable: true,
});

export const Dep = defineEruditTag({
  tagName: 'Dep',
  schema: depSchema,
})<{ on: Exclude<LinkToProp, string> } & RequiredChildren & NoSnippet & NoToc>(
  ({ element, tagName, props, children }) => {
    handleLinkTag(element, tagName, props, children);
  },
);

export const Dependency = defineEruditTag({
  tagName: 'Dependency',
  schema: dependencySchema,
})<{ on: Exclude<LinkToProp, string> } & RequiredChildren & NoSnippet & NoToc>(
  ({ element, tagName, props, children }) => {
    handleLinkTag(element, tagName, props, children);
  },
);

export default defineProseCoreElements(
  {
    schema: depSchema,
    tags: [Dep],
  },
  {
    schema: dependencySchema,
    tags: [Dependency],
  },
);
