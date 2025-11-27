import {
    defineRegistryItem,
    defineSchema,
    ensureTagChildren,
    type AnySchema,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElements } from '../../coreElement.js';

export const listItemSchema = defineSchema({
    name: 'listItem',
    type: 'block',
    linkable: false,
})<{
    Data: undefined;
    Storage: undefined;
    Children: AnySchema[];
}>();

export const Li = defineEruditTag({
    tagName: 'Li',
    schema: listItemSchema,
})<TagChildren>(({ tagName, element, children }) => {
    ensureTagChildren(tagName, children);
    element.children = children;
});

export interface UlListData {
    type: 'ul';
}

export interface OlListData {
    type: 'ol';
    start?: number;
}

export const listSchema = defineSchema({
    name: 'list',
    type: 'block',
    linkable: true,
})<{
    Data: UlListData | OlListData;
    Storage: undefined;
    Children: (typeof listItemSchema)[];
}>();

export const List = defineEruditTag({
    tagName: 'List',
    schema: listSchema,
})<({ type: 'ol'; start?: number } | { type: 'ul' }) & TagChildren>(({
    element,
    tagName,
    props,
    children,
}) => {
    ensureTagChildren(tagName, children, listItemSchema);
    element.children = children;

    if (props.type === 'ol') {
        element.data = { type: 'ol' };
        if (props.start !== undefined) {
            element.data.start = props.start;
        }
    } else {
        element.data = { type: 'ul' };
    }
});

export const listItemRegistryItem = defineRegistryItem({
    schema: listItemSchema,
    tags: [Li],
});

export const listRegistryItem = defineRegistryItem({
    schema: listSchema,
    tags: [List],
});

export default defineEruditProseCoreElements(
    { registryItem: listItemRegistryItem },
    { registryItem: listRegistryItem },
);
