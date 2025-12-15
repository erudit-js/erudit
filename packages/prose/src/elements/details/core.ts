import {
    defineRegistryItem,
    defineSchema,
    ensureTagChildren,
    ProseError,
    type AnySchema,
    type Tag,
    type TagChildren,
    type Unique,
} from '@jsprose/core';

import { defineEruditProseCoreElement } from '../../coreElement.js';
import { defineEruditTag, type NoSnippet, type NoToc } from '../../tag.js';

export interface DetailsData {
    title?: string;
}

export const detailsSchema = defineSchema({
    name: 'details',
    type: 'block',
    linkable: true,
})<{
    Data: DetailsData;
    Storage: undefined;
    Children: AnySchema[];
}>();

export const detailsTagName = 'Details';

export const Details = defineEruditTag({
    tagName: detailsTagName,
    schema: detailsSchema,
})<
    {
        title?: string;
        // Require unique
        $: Unique<Tag<typeof detailsTagName, typeof detailsSchema, any>>;
    } & TagChildren &
        NoToc &
        NoSnippet
>(({ element, tagName, children, props }) => {
    if (!element.uniqueName) {
        throw new ProseError(`<${tagName}> must be connected to unique!`);
    }

    ensureTagChildren(tagName, children);
    element.children = children;

    const title = props.title?.trim();
    if (title) {
        element.data = { title };
        element.slug = title;
        element.title = title;
    }
});

export const detailsRegistryItem = defineRegistryItem({
    schema: detailsSchema,
    tags: [Details],
});

export default defineEruditProseCoreElement({
    registryItem: detailsRegistryItem,
});
