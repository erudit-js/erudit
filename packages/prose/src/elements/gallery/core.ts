import {
    defineRegistryItem,
    defineSchema,
    ensureTagChildren,
    type TagChildren,
} from '@jsprose/core';

import { imageSchema } from '../image/core.js';
import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';

export const gallerySchema = defineSchema({
    name: 'gallery',
    type: 'block',
    linkable: true,
})<{
    Data: undefined;
    Storage: undefined;
    Children: (typeof imageSchema)[];
}>();

export const Gallery = defineEruditTag({
    tagName: 'Gallery',
    schema: gallerySchema,
})<TagChildren>(({ element, tagName, children }) => {
    ensureTagChildren(tagName, children, imageSchema);
    element.children = children;
});

export const galleryRegistryItem = defineRegistryItem({
    schema: gallerySchema,
    tags: [Gallery],
});

export default defineEruditProseCoreElement({
    registryItem: galleryRegistryItem,
});
