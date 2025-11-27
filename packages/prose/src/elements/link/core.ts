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
import {
    parseProseLink,
    stringifyProseLink,
    type ContentProseType,
    type ProseLinkType,
} from '@erudit-js/cog/schema';

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
    Storage: ContentDocumentLinkStorage | ContentElementLinkStorage;
    Children: undefined;
}>();

export const A = defineEruditTag({
    tagName: 'A',
    schema: linkSchema,
})<{ to: string | AnyUnique | AnyDocument } & TagChildren & NoSnippet & NoToc>(
    ({ element, tagName, props, children }) => {
        handleLinkTag(element, tagName, props, children);
    },
);

export const BlockLink = defineEruditTag({
    tagName: 'BlockLink',
    schema: blockLinkSchema,
})<{ to: AnyUnique | AnyDocument } & TagChildren & NoSnippet & NoToc>(({
    element,
    tagName,
    props,
    children,
}) => {
    handleLinkTag(element, tagName, props, children);
});

function resolveLinkStorage(
    to: string | AnyUnique | AnyDocument,
    tagName: string,
): string {
    if (typeof to === 'string') {
        return stringifyProseLink({
            type: 'direct',
            href: to,
        });
    }

    if (isUnique(to)) {
        const targetUniqueId = uniqueName2Id(to.name);
        const targetDocumentId = to.documentId;
        const targetDocumentLink = parseProseLink(targetDocumentId);

        if (targetDocumentLink.type === 'contentDocument') {
            return stringifyProseLink({
                type: 'contentElement',
                isUnique: true,
                contentType: targetDocumentLink.contentType,
                fullContentId: targetDocumentLink.fullContentId,
                elementId: targetUniqueId,
            });
        }
        throw new ProseError(
            `
Unique links can only point to content documents!
But detected unique link that points to document ID of type "${targetDocumentLink.type}"!
            `.trim(),
        );
    }

    if (isDocument(to)) {
        const targetDocumentLink = parseProseLink(to.documentId);
        if (targetDocumentLink.type === 'contentDocument') {
            return stringifyProseLink({
                type: 'contentDocument',
                contentType: targetDocumentLink.contentType,
                fullContentId: targetDocumentLink.fullContentId,
            });
        }
        throw new ProseError(
            `
Unique links can only point to content documents!
But detected unique link that points to document ID of type "${targetDocumentLink.type}"!
            `.trim(),
        );
    }

    throw new ProseError(`<${tagName}> is unable to resolve "to" prop value!`);
}

function handleLinkTag(
    element: EruditRawElement<typeof linkSchema | typeof blockLinkSchema>,
    tagName: string,
    props: { to: string | AnyUnique | AnyDocument },
    children: NormalizedChildren,
) {
    ensureTagChild(tagName, children, [textSchema]);
    const child = children[0];
    const label = child.data.trim();

    if (!label) {
        throw new ProseError(`<${tagName}> label cannot be empty!`);
    }

    element.data = { label };
    element.storageKey = resolveLinkStorage(props.to, tagName);
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

interface LinkStorageBase {
    type: ProseLinkType;
    resolvedHref: string;
}

export interface DirectLinkStorage extends LinkStorageBase {
    type: 'direct';
}

export interface ContentDocumentLinkStorage extends LinkStorageBase {
    type: 'contentDocument';
    contentType: ContentProseType;
    contentFullId: string;
    contentTitle: string;
}

export interface ContentElementLinkStorage extends LinkStorageBase {
    type: 'contentElement';
    isUnique: boolean;
    schemaName: string;
    elementTitle?: string;
    contentType: ContentProseType;
    contentFullId: string;
    contentTitle: string;
}

export type LinkStorage =
    | DirectLinkStorage
    | ContentDocumentLinkStorage
    | ContentElementLinkStorage;

//
// Resolve
//

export const linkStep = defineResolveStep(({ rawElement, proseElement }) => {
    if (!proseElement.id) {
        return;
    }

    if (!rawElement.storageKey) {
        return;
    }

    if (
        !isRawElement(rawElement, linkSchema) &&
        !isRawElement(rawElement, blockLinkSchema)
    ) {
        return;
    }

    return [proseElement.id, rawElement.storageKey];
});
