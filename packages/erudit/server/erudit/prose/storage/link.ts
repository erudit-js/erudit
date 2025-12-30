import {
    ProseError,
    uniqueName2Id,
    type GenericStorage,
    type ProseElement,
} from '@jsprose/core';

import { isTopicPart } from '@erudit-js/core/content/topic';
import type { ContentPointer } from '@erudit-js/core/content/pointer';
import type {
    referenceSchema,
    refSchema,
} from '@erudit-js/prose/elements/link/reference/core';
import type {
    dependencySchema,
    depSchema,
} from '@erudit-js/prose/elements/link/dependency/core';
import type { LinkStorage } from '@erudit-js/prose/elements/link/storage';

export async function createLinkStorage(
    element:
        | ProseElement<typeof refSchema>
        | ProseElement<typeof referenceSchema>
        | ProseElement<typeof depSchema>
        | ProseElement<typeof dependencySchema>,
    storage: GenericStorage,
) {
    let linkStorage: LinkStorage | undefined;

    const storageKeyParts = element.storageKey!.split('/');
    const linkType = storageKeyParts[0];
    const strProseLink = storageKeyParts.slice(1).join('/');

    if (linkType === '<link:direct>') {
        linkStorage = {
            type: 'direct',
            resolvedHref: strProseLink,
            previewRequest: {
                type: 'direct-link',
                href: strProseLink,
            },
        };
    } else if (linkType === '<link:global>') {
        const proseLinkParts = strProseLink.split('/');
        const uniquePart = proseLinkParts.pop();

        if (uniquePart?.startsWith('$')) {
            //
            // Unique link
            //

            const contentPointer = await getContentPointerFor(
                proseLinkParts.join('/'),
            );

            const shortId = ERUDIT.contentNav.getNodeOrThrow(
                contentPointer.id,
            ).shortId;

            const contentTitle = await ERUDIT.repository.content.title(
                contentPointer.id,
            );

            const uniqueName = uniquePart.slice(1);
            const unique = await ERUDIT.repository.content.unique(
                contentPointer.id,
                contentPointer.type === 'topic' ? contentPointer.part : 'page',
                uniqueName,
            );

            if (contentPointer.type === 'topic') {
                linkStorage = {
                    type: 'unique',
                    schemaName: unique.prose.schemaName,
                    elementTitle: unique.title || undefined,
                    content: {
                        contentType: 'topic',
                        contentTitle,
                        topicPart: contentPointer.part,
                    },
                    resolvedHref: PAGES.topic(
                        contentPointer.part,
                        shortId,
                        uniqueName2Id(uniqueName),
                    ),
                    previewRequest: {
                        type: 'unique',
                        contentFullId: contentPointer.id,
                        contentType: 'topic',
                        topicPart: contentPointer.part,
                        uniqueName: uniqueName,
                    },
                };
            } else {
                linkStorage = {
                    type: 'unique',
                    schemaName: unique.prose.schemaName,
                    elementTitle: unique.title || undefined,
                    content: {
                        contentType: contentPointer.type,
                        contentTitle,
                    },
                    resolvedHref: PAGES.page(
                        shortId,
                        uniqueName2Id(uniqueName),
                    ),
                    previewRequest: {
                        type: 'unique',
                        contentFullId: contentPointer.id,
                        contentType: 'page',
                        uniqueName: uniqueName,
                    },
                };
            }
        } else {
            //
            // Content item link
            //

            const contentPointer = await getContentPointerFor(strProseLink);

            const shortId = ERUDIT.contentNav.getNodeOrThrow(
                contentPointer.id,
            ).shortId;

            const contentTitle = await ERUDIT.repository.content.title(
                contentPointer.id,
            );

            if (contentPointer.type === 'topic') {
                linkStorage = {
                    type: 'contentItem',
                    content: {
                        contentType: 'topic',
                        contentTitle,
                        topicPart: contentPointer.part,
                    },
                    resolvedHref: PAGES.topic(contentPointer.part, shortId),
                    previewRequest: {
                        type: 'content-page',
                        contentType: 'topic',
                        topicPart: contentPointer.part,
                        fullId: contentPointer.id,
                    },
                };
            } else {
                linkStorage = {
                    type: 'contentItem',
                    content: {
                        contentType: contentPointer.type,
                        contentTitle,
                    },
                    resolvedHref: PAGES[contentPointer.type](shortId),
                    previewRequest: {
                        type: 'content-page',
                        contentType: contentPointer.type,
                        fullId: contentPointer.id,
                    },
                };
            }
        }
    }

    if (!linkStorage) {
        throw new ProseError(
            `Unable to create prose link storage for link: ${element.storageKey}`,
        );
    }

    storage[element.storageKey!] = linkStorage;
}

async function getContentPointerFor(
    contentId: string,
): Promise<ContentPointer> {
    if (!contentId) {
        throw new ProseError(`Invalid content ID: "${contentId}"!`);
    }

    const contentNavNode = ERUDIT.contentNav.getNode(contentId);

    if (contentNavNode) {
        if (contentNavNode.type === 'topic') {
            const defaultTopicPart =
                await ERUDIT.repository.content.defaultTopicPart(
                    contentNavNode.fullId,
                );

            return {
                type: 'topic',
                id: contentNavNode.fullId,
                part: defaultTopicPart,
            };
        } else {
            return {
                type: contentNavNode.type,
                id: contentNavNode.fullId,
            };
        }
    }

    const contentIdParts = contentId.split('/');
    const maybeTopicPart = contentIdParts.pop()!;

    if (!isTopicPart(maybeTopicPart)) {
        throw new ProseError(
            `Prose link part "${contentId}" must be a valid topic part!`,
        );
    }

    const shortenedContentNavNode = ERUDIT.contentNav.getNode(
        contentIdParts.join('/'),
    );

    if (shortenedContentNavNode) {
        return {
            type: 'topic',
            id: shortenedContentNavNode.fullId,
            part: maybeTopicPart,
        };
    }

    throw new ProseError(
        `Unable to find content for prose link: "${contentId}"!`,
    );
}
