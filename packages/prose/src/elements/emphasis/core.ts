import {
    defineRegistryItem,
    defineSchema,
    ensureTagInlinerChildren,
    type InlinerSchema,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditProseCoreElement } from '../../coreElement.js';
import { defineEruditTag } from '../../tag.js';

export interface EmphasisData {
    type: 'bold' | 'italic';
}

export const emphasisSchema = defineSchema({
    name: 'emphasis',
    type: 'inliner',
    linkable: true,
})<{
    Data: EmphasisData;
    Storage: undefined;
    Children: InlinerSchema[];
}>();

export const B = defineEruditTag({
    tagName: 'B',
    schema: emphasisSchema,
})<TagChildren>(({ element, tagName, children, registry }) => {
    ensureTagInlinerChildren(tagName, children, registry);
    element.children = children;
    element.data = { type: 'bold' };
});

export const I = defineEruditTag({
    tagName: 'I',
    schema: emphasisSchema,
})<TagChildren>(({ element, tagName, children, registry }) => {
    ensureTagInlinerChildren(tagName, children, registry);
    element.children = children;
    element.data = { type: 'italic' };
});

export const emphasisRegistryItem = defineRegistryItem({
    schema: emphasisSchema,
    tags: [B, I],
});

export default defineEruditProseCoreElement({
    registryItem: emphasisRegistryItem,
});
