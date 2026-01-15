import {
    defineRegistryItem,
    defineSchema,
    ensureTagChild,
    ProseError,
    textSchema,
    type NormalizedChildren,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditTag, type NoToc } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';
import type { EruditRawElement } from '../../rawElement.js';

export const headingSchema = defineSchema({
    name: 'heading',
    type: 'block',
    linkable: true,
})<{
    Data: HeadingData;
    Storage: undefined;
    Children: undefined;
}>();

export interface HeadingData {
    level: 1 | 2 | 3;
    title: string;
}

export type HeadingProps = TagChildren & NoToc;

export const H1 = defineEruditTag({
    tagName: 'H1',
    schema: headingSchema,
})<HeadingProps>(({ tagName, element, children }) => {
    processHeadingElement(1, tagName, element, children);
});

export const H2 = defineEruditTag({
    tagName: 'H2',
    schema: headingSchema,
})<HeadingProps>(({ tagName, element, children }) => {
    processHeadingElement(2, tagName, element, children);
});

export const H3 = defineEruditTag({
    tagName: 'H3',
    schema: headingSchema,
})<HeadingProps>(({ tagName, element, children }) => {
    processHeadingElement(3, tagName, element, children);
});

function processHeadingElement(
    level: 1 | 2 | 3,
    tagName: string,
    element: EruditRawElement<typeof headingSchema>,
    children: NormalizedChildren,
) {
    ensureTagChild(tagName, children, textSchema);
    const child = children[0];
    const title = child.data.trim();

    if (!title) {
        throw new ProseError(`<${tagName}> title cannot be empty!`);
    }

    element.data = {
        level,
        title,
    };

    element.title = title;

    element.snippetFlags ||= {};
    element.snippetFlags.search ??= true;
    element.snippetFlags.seo ??= false;

    element.toc = {
        add: true,
    };
}

export const headingRegistryItem = defineRegistryItem({
    schema: headingSchema,
    tags: [H1, H2, H3],
});

export default defineEruditProseCoreElement({
    registryItem: headingRegistryItem,
});
