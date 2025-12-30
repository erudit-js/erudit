import {
    defineRegistryItem,
    defineSchema,
    type TagChildren,
} from '@jsprose/core';

import { handleLinkTag, type LinkData, type LinkToProp } from '../core.js';
import type { LinkStorage } from '../storage.js';
import { defineEruditTag, type NoSnippet, type NoToc } from '../../../tag.js';
import { defineEruditProseCoreElements } from '../../../coreElement.js';

export const refSchema = defineSchema({
    name: 'referenceInliner',
    type: 'inliner',
    linkable: true,
})<{
    Data: LinkData;
    Storage: LinkStorage;
    Children: undefined;
}>();

export const referenceSchema = defineSchema({
    name: 'referenceBlock',
    type: 'block',
    linkable: true,
})<{
    Data: LinkData;
    Storage: LinkStorage;
    Children: undefined;
}>();

export const Ref = defineEruditTag({
    tagName: 'Ref',
    schema: refSchema,
})<{ to: LinkToProp } & TagChildren & NoSnippet & NoToc>(({
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
})<{ to: Exclude<LinkToProp, string> } & TagChildren & NoSnippet & NoToc>(({
    element,
    tagName,
    props,
    children,
}) => {
    handleLinkTag(element, tagName, props, children);
});

export const refRegistryItem = defineRegistryItem({
    schema: refSchema,
    tags: [Ref],
});

export const referenceRegistryItem = defineRegistryItem({
    schema: referenceSchema,
    tags: [Reference],
});

export default defineEruditProseCoreElements(
    { registryItem: refRegistryItem },
    { registryItem: referenceRegistryItem },
);
