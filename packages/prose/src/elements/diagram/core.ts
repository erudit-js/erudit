import {
    defineRegistryItem,
    defineSchema,
    ensureRawElement,
    ensureTagChildren,
    textSchema,
    type TagChildren,
} from '@jsprose/core';

import { captionSchema } from '../caption/core.js';
import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';

export const diagramSchema = defineSchema({
    name: 'diagram',
    type: 'block',
    linkable: true,
})<{
    Data: undefined;
    Storage: undefined;
    Children: [typeof textSchema] | [typeof textSchema, typeof captionSchema];
}>();

export const Diagram = defineEruditTag({
    tagName: 'Diagram',
    schema: diagramSchema,
})<TagChildren>(({ element, tagName, children }) => {
    ensureTagChildren(tagName, children, [textSchema, captionSchema]);

    ensureRawElement(children[0], textSchema);
    element.children = [children[0]];

    if (children[1]) {
        ensureRawElement(children[1], captionSchema);
        element.children = [children[0], children[1]];
    }
});

export const diagramRegistryItem = defineRegistryItem({
    schema: diagramSchema,
    tags: [Diagram],
});

export default defineEruditProseCoreElement({
    registryItem: diagramRegistryItem,
    dependencies: {
        mermaid: {
            optimize: true,
            transpile: true,
        },
    },
});
