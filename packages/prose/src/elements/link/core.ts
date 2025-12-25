import {
    defineRegistryItem,
    defineSchema,
    ensureTagChild,
    isRawElement,
    isUnique,
    ProseError,
    textSchema,
    type AnySchema,
    type AnyUnique,
    type NormalizedChildren,
    type ProseElement,
    type TagChildren,
} from '@jsprose/core';
import type { PreviewRequest } from '@erudit-js/core/preview/request';
import type { ContentType } from '@erudit-js/core/content/type';
import type { TopicPart } from '@erudit-js/core/content/topic';
import type {
    GlobalLink,
    GlobalLinkTypeguard,
} from '@erudit-js/core/prose/link';
import { parseDocumentId } from '@erudit-js/core/prose/documentId';

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
    Storage: LinkStorage;
    Children: undefined;
}>();

export const blockLinkSchema = defineSchema({
    name: 'blockLink',
    type: 'block',
    linkable: true,
})<{
    Data: LinkData;
    Storage: LinkStorage;
    Children: undefined;
}>();

export const A = defineEruditTag({
    tagName: 'A',
    schema: linkSchema,
})<
    { to: string | GlobalLinkTypeguard | AnyUnique } & TagChildren &
        NoSnippet &
        NoToc
>(({ element, tagName, props, children }) => {
    handleLinkTag(element, tagName, props, children);
});

export const BlockLink = defineEruditTag({
    tagName: 'BlockLink',
    schema: blockLinkSchema,
})<{ to: GlobalLinkTypeguard | AnyUnique } & TagChildren & NoSnippet & NoToc>(({
    element,
    tagName,
    props,
    children,
}) => {
    handleLinkTag(element, tagName, props, children);
});

function handleLinkTag(
    element: EruditRawElement<typeof linkSchema | typeof blockLinkSchema>,
    tagName: string,
    props: { to: string | GlobalLinkTypeguard | AnyUnique },
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
    to: string | GlobalLinkTypeguard | AnyUnique,
    tagName: string,
): string {
    if (isUnique(to)) {
        const documentId = parseDocumentId(to.documentId);

        if (documentId.type === 'contentPage') {
            return `<link:global>/${documentId.contentId}/$${to.name}`;
        } else if (documentId.type === 'contentTopic') {
            return `<link:global>/${documentId.contentId}/${documentId.topicPart}/$${to.name}`;
        }
    }

    if (typeof to === 'string') {
        return `<link:direct>/${to}`;
    }

    const toLink = to as unknown as GlobalLink;

    if (toLink.__link) {
        return `<link:global>/${toLink.__link}`;
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

export type StorageLinkType = 'direct' | 'contentItem' | 'unique';

interface LinkStorageBase {
    type: StorageLinkType;
    resolvedHref: string;
    previewRequest: PreviewRequest;
}

export type LinkStorageContent = {
    contentTitle: string;
} & (
    | {
          contentType: 'topic';
          topicPart: TopicPart;
      }
    | {
          contentType: Exclude<ContentType, 'topic'>;
      }
);

export interface DirectLinkStorage extends LinkStorageBase {
    type: 'direct';
}

export interface ContentItemLinkStorage extends LinkStorageBase {
    type: 'contentItem';
    content: LinkStorageContent;
}

export interface UniqueLinkStorage extends LinkStorageBase {
    type: 'unique';
    schemaName: string;
    elementTitle?: string;
    content: LinkStorageContent;
}

export type LinkStorage =
    | DirectLinkStorage
    | ContentItemLinkStorage
    | UniqueLinkStorage;

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
