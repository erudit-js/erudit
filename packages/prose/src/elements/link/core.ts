import {
    defineRegistryItem,
    defineSchema,
    ensureTagChild,
    isDocument,
    isRawElement,
    isUnique,
    ProseError,
    textSchema,
    uniqueName2Id,
    type AnyDocument,
    type AnySchema,
    type AnyUnique,
    type NormalizedChildren,
    type ProseElement,
    type TagChildren,
} from '@jsprose/core';

import { type ContentItem } from '@erudit-js/core/content/item';
import { stringifyProseLink } from '@erudit-js/core/prose/link';
import { parseDocumentId } from '@erudit-js/core/prose/documentId';
import { parseContentItemId } from '@erudit-js/core/content/itemId';

import { defineEruditTag, type NoSnippet, type NoToc } from '../../tag.js';
import type { EruditProseContext } from '../../context.js';
import type { EruditRawElement } from '../../rawElement.js';
import { defineResolveStep } from '../../resolveStep.js';
import { defineEruditProseCoreElements } from '../../coreElement.js';

export const linkSchema = defineSchema({
    name: 'link',
    type: 'inliner',
    linkable: true,
})<{
    Data: LinkData;
    Storage: string; // TODO
    //Storage: LinkStorage;
    Children: undefined;
}>();

export const blockLinkSchema = defineSchema({
    name: 'blockLink',
    type: 'block',
    linkable: true,
})<{
    Data: LinkData;
    Storage: string; // TODO
    //Storage: ContentDocumentLinkStorage | ContentElementLinkStorage;
    Children: undefined;
}>();

export const A = defineEruditTag({
    tagName: 'A',
    schema: linkSchema,
})<
    { to: string | AnyUnique | AnyDocument | ContentItem } & TagChildren &
        NoSnippet &
        NoToc
>(({ element, tagName, props, children }) => {
    handleLinkTag(element, tagName, props, children);
});

export const BlockLink = defineEruditTag({
    tagName: 'BlockLink',
    schema: blockLinkSchema,
})<
    { to: AnyUnique | AnyDocument | ContentItem } & TagChildren &
        NoSnippet &
        NoToc
>(({ element, tagName, props, children }) => {
    handleLinkTag(element, tagName, props, children);
});

function handleLinkTag(
    element: EruditRawElement<typeof linkSchema | typeof blockLinkSchema>,
    tagName: string,
    props: { to: string | AnyUnique | AnyDocument | ContentItem },
    children: NormalizedChildren,
) {
    ensureTagChild(tagName, children, [textSchema]);
    const child = children[0];
    const label = child.data.trim();

    if (!label) {
        throw new ProseError(`<${tagName}> label cannot be empty!`);
    }

    element.data = { label };
    element.storageKey = createLinkStorageKey(props.to, tagName);
}

function createLinkStorageKey(
    to: string | AnyUnique | AnyDocument | ContentItem,
    tagName: string,
): string {
    if (typeof to === 'string') {
        return stringifyProseLink({
            type: 'direct',
            href: to,
        });
    }

    if (isUnique(to)) {
        return stringifyProseLink({
            type: 'unique',
            documentId: parseDocumentId(to.documentId)!,
            uniqueId: uniqueName2Id(to.name),
        });
    }

    if (isDocument(to)) {
        return stringifyProseLink({
            type: 'document',
            documentId: parseDocumentId(to.documentId)!,
        });
    }

    if (to.__ERUDIT_contentItem) {
        return stringifyProseLink({
            type: 'contentItem',
            itemId: parseContentItemId(to.itemId!)!,
        });
    }

    throw new ProseError(`<${tagName}> is unable to resolve "to" prop value!`);
}

//
// Registry & Erudit core
//

export const linkRegistryItem = defineRegistryItem({
    schema: linkSchema,
    tags: [A],
});

export const blockLinkRegistryItem = defineRegistryItem({
    schema: blockLinkSchema,
    tags: [BlockLink],
});

export default defineEruditProseCoreElements(
    { registryItem: linkRegistryItem },
    { registryItem: blockLinkRegistryItem },
);

//
// Data
//

export interface LinkData {
    label: string;
}

//
// Storage
//

// interface LinkStorageBase {
//     type: ProseLinkType;
//     resolvedHref: string;
// }

// export interface DirectLinkStorage extends LinkStorageBase {
//     type: 'direct';
// }

// export interface ContentDocumentLinkStorage extends LinkStorageBase {
//     type: 'contentDocument';
//     contentType: ContentProseType;
//     contentFullId: string;
//     contentTitle: string;
// }

// export interface ContentElementLinkStorage extends LinkStorageBase {
//     type: 'contentElement';
//     isUnique: boolean;
//     schemaName: string;
//     elementTitle?: string;
//     contentType: ContentProseType;
//     contentFullId: string;
//     contentTitle: string;
// }

// export type LinkStorage =
//     | DirectLinkStorage
//     | ContentDocumentLinkStorage
//     | ContentElementLinkStorage;

//
// Resolve
//

export const linkStep = defineResolveStep(({ rawElement, proseElement }) => {
    if (
        !isRawElement(rawElement, linkSchema) &&
        !isRawElement(rawElement, blockLinkSchema)
    ) {
        return;
    }

    if (!proseElement.id) {
        return;
    }

    if (!rawElement.storageKey) {
        return;
    }

    return rawElement.storageKey;
});
