import {
    defineRegistryItem,
    defineSchema,
    ensureTagInlinerChildren,
    type InlinerSchema,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditProseCoreElement } from '../../coreElement.js';
import { defineEruditTag } from '../../tag.js';

export const paragraphSchema = defineSchema({
    name: 'paragraph',
    type: 'block',
    linkable: true,
})<{
    Data: ParagraphData;
    Storage: undefined;
    Children: InlinerSchema[];
}>();

export type ParagraphData =
    | undefined
    | {
          center?: boolean;
          serif?: boolean;
      };

export const P = defineEruditTag({
    tagName: 'P',
    schema: paragraphSchema,
})<{ center?: true; serif?: true } & TagChildren>(({
    element,
    tagName,
    props,
    children,
    registry,
}) => {
    ensureTagInlinerChildren(tagName, children, registry);
    element.children = children;

    if (props.center || props.serif) {
        element.data = {};
        if (props.center) {
            element.data.center = true;
        }
        if (props.serif) {
            element.data.serif = true;
        }
    }
});

export const paragraphRegistryItem = defineRegistryItem({
    schema: paragraphSchema,
    tags: [P],
});

export default defineEruditProseCoreElement({
    registryItem: paragraphRegistryItem,
});
