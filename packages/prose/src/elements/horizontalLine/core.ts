import {
    defineRegistryItem,
    defineSchema,
    ensureTagNoChildren,
    type NoTagChildren,
} from '@jsprose/core';

import { defineEruditProseCoreElement } from '../../coreElement.js';
import { defineEruditTag } from '../../tag.js';

export const hrSchema = defineSchema({
    name: 'hr',
    type: 'block',
    linkable: false,
})<{
    Data: undefined;
    Storage: undefined;
    Children: undefined;
}>();

export const Hr = defineEruditTag({
    tagName: 'Hr',
    schema: hrSchema,
})<NoTagChildren>(({ tagName, children }) => {
    ensureTagNoChildren(tagName, children);
});

export const hrRegistryItem = defineRegistryItem({
    schema: hrSchema,
    tags: [Hr],
});

export default defineEruditProseCoreElement({
    registryItem: hrRegistryItem,
});
