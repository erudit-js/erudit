import {
    ProseError,
    uniqueName2Id,
    type GenericStorage,
    type ProseElement,
} from '@jsprose/core';
import { parseProseLink } from '@erudit-js/core/prose/link';
import type {
    blockLinkSchema,
    ContentItemLinkStorage,
    DirectLinkStorage,
    linkSchema,
    LinkStorage,
    UniqueLinkStorage,
} from '@erudit-js/prose/elements/link/core';

export async function createLinkStorage(
    element:
        | ProseElement<typeof linkSchema>
        | ProseElement<typeof blockLinkSchema>,
    storage: GenericStorage,
) {
    const proseLink = parseProseLink(element.storageKey!)!;
    let linkStorage: LinkStorage | undefined;

    if (proseLink.type === 'direct') {
        linkStorage = {
            type: 'direct',
            resolvedHref: proseLink.href,
            previewRequest: {
                type: 'direct-link',
                href: proseLink.href,
            },
        } satisfies DirectLinkStorage;
    } else if (proseLink.type === 'contentItem') {
        const contentItemId = proseLink.itemId;
        const contentNavNode = ERUDIT.contentNav.getNodeOrThrow(
            contentItemId.contentId,
        );
        const shortId = contentNavNode.shortId;
        const contentTitle = await ERUDIT.repository.content.title(
            contentNavNode.fullId,
        );

        if (contentItemId.type === 'topic') {
            const defaultTopicPart =
                await ERUDIT.repository.content.defaultTopicPart(
                    contentNavNode.fullId,
                );

            linkStorage = {
                type: 'contentItem',
                resolvedHref: PAGES.topic(defaultTopicPart, shortId),
                previewRequest: {
                    type: 'content-page',
                    contentType: 'topic',
                    topicPart: defaultTopicPart,
                    fullId: contentNavNode.fullId,
                },
                content: {
                    contentType: 'topic',
                    topicPart: defaultTopicPart,
                    contentTitle,
                },
            } satisfies ContentItemLinkStorage;
        } else {
            linkStorage = {
                type: 'contentItem',
                resolvedHref: PAGES[contentItemId.type](shortId),
                previewRequest: {
                    type: 'content-page',
                    contentType: contentItemId.type,
                    fullId: contentNavNode.fullId,
                },
                content: {
                    contentType: contentItemId.type,
                    contentTitle,
                },
            } satisfies ContentItemLinkStorage;
        }
    } else if (proseLink.type === 'document') {
        const documentId = proseLink.documentId;
        const contentNavNode = ERUDIT.contentNav.getNodeOrThrow(
            documentId.contentId,
        );
        const shortId = contentNavNode.shortId;
        const contentTitle = await ERUDIT.repository.content.title(
            contentNavNode.fullId,
        );

        if (documentId.type === 'contentPage') {
            linkStorage = {
                type: 'contentItem',
                resolvedHref: PAGES.page(shortId),
                previewRequest: {
                    type: 'content-page',
                    contentType: 'page',
                    fullId: contentNavNode.fullId,
                },
                content: {
                    contentType: 'page',
                    contentTitle,
                },
            } satisfies ContentItemLinkStorage;
        } else if (documentId.type === 'contentTopic') {
            linkStorage = {
                type: 'contentItem',
                resolvedHref: PAGES.topic(documentId.topicPart, shortId),
                previewRequest: {
                    type: 'content-page',
                    contentType: 'topic',
                    topicPart: documentId.topicPart,
                    fullId: contentNavNode.fullId,
                },
                content: {
                    contentType: 'topic',
                    topicPart: documentId.topicPart,
                    contentTitle,
                },
            } satisfies ContentItemLinkStorage;
        }
    } else if (proseLink.type === 'unique') {
        const documentId = proseLink.documentId;
        const contentNavNode = ERUDIT.contentNav.getNodeOrThrow(
            documentId.contentId,
        );
        const shortId = contentNavNode.shortId;
        const contentTitle = await ERUDIT.repository.content.title(
            contentNavNode.fullId,
        );
        const contentUnique = await ERUDIT.repository.content.unique(
            contentNavNode.fullId,
            documentId.type === 'contentPage' ? 'page' : documentId.topicPart,
            proseLink.uniqueName,
        );

        if (documentId.type === 'contentPage') {
            linkStorage = {
                type: 'unique',
                resolvedHref: PAGES.page(
                    shortId,
                    uniqueName2Id(proseLink.uniqueName),
                ),
                previewRequest: {
                    type: 'unique',
                    contentFullId: contentNavNode.fullId,
                    contentType: 'page',
                    uniqueName: proseLink.uniqueName,
                },
                schemaName: contentUnique.prose.schemaName,
                elementTitle: contentUnique.title || undefined,
                content: {
                    contentType: 'page',
                    contentTitle,
                },
            } satisfies UniqueLinkStorage;
        } else if (documentId.type === 'contentTopic') {
            linkStorage = {
                type: 'unique',
                resolvedHref: PAGES.topic(
                    documentId.topicPart,
                    shortId,
                    uniqueName2Id(proseLink.uniqueName),
                ),
                previewRequest: {
                    type: 'unique',
                    contentFullId: contentNavNode.fullId,
                    contentType: 'topic',
                    topicPart: documentId.topicPart,
                    uniqueName: proseLink.uniqueName,
                },
                schemaName: contentUnique.prose.schemaName,
                elementTitle: contentUnique.title || undefined,
                content: {
                    contentType: 'topic',
                    topicPart: documentId.topicPart,
                    contentTitle,
                },
            } satisfies UniqueLinkStorage;
        }
    }

    if (!linkStorage) {
        throw new ProseError(
            `Unable to create prose link storage for link: ${element.storageKey}`,
        );
    }

    storage[element.storageKey!] = linkStorage;
}
