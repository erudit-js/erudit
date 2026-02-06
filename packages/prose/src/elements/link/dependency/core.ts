import {
  defineRegistryItem,
  defineSchema,
  type TagChildren,
} from '@jsprose/core';

import { handleLinkTag, type LinkData, type LinkToProp } from '../core.js';
import type { ExternalLinkStorage, LinkStorage } from '../storage.js';
import { defineEruditTag, type NoSnippet, type NoToc } from '../../../tag.js';
import { defineEruditProseCoreElements } from '../../../coreElement.js';

export const depSchema = defineSchema({
  name: 'dependencyInliner',
  type: 'inliner',
  linkable: true,
})<{
  Data: LinkData;
  Storage: Exclude<LinkStorage, ExternalLinkStorage>;
  Children: undefined;
}>();

export const dependencySchema = defineSchema({
  name: 'dependencyBlock',
  type: 'block',
  linkable: true,
})<{
  Data: LinkData;
  Storage: Exclude<LinkStorage, ExternalLinkStorage>;
  Children: undefined;
}>();

export const Dep = defineEruditTag({
  tagName: 'Dep',
  schema: depSchema,
})<{ to: Exclude<LinkToProp, string> } & TagChildren & NoSnippet & NoToc>(({
  element,
  tagName,
  props,
  children,
}) => {
  handleLinkTag(element, tagName, props, children);
});

export const Dependency = defineEruditTag({
  tagName: 'Dependency',
  schema: dependencySchema,
})<{ to: Exclude<LinkToProp, string> } & TagChildren & NoSnippet & NoToc>(({
  element,
  tagName,
  props,
  children,
}) => {
  handleLinkTag(element, tagName, props, children);
});

export const depRegistryItem = defineRegistryItem({
  schema: depSchema,
  tags: [Dep],
});

export const dependencyRegistryItem = defineRegistryItem({
  schema: dependencySchema,
  tags: [Dependency],
});

export default defineEruditProseCoreElements(
  { registryItem: depRegistryItem },
  { registryItem: dependencyRegistryItem },
);
