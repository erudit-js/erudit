import { eq } from 'drizzle-orm';

import {
    ContentType,
    isTopicPart,
    type TopicPart,
} from '@erudit-js/cog/schema';
import type { ParsedElement, GenericStorage } from '@erudit-js/prose';
import {
    LinkType,
    type LinkSchema,
    type LinkStorage,
} from '@erudit-js/prose/default/link/index';
import type { BlockLinkSchema } from '@erudit-js/prose/default/blockLink/index';

export async function createLinkStorage(
    element: ParsedElement<LinkSchema> | ParsedElement<BlockLinkSchema>,
    storage: GenericStorage,
): Promise<void> {
    const linkData = element.data;

    if (linkData.type === LinkType.Direct) {
        return;
    }

    const storageKey = element.storageKey!;
    let storageValue: LinkStorage = storage[storageKey] as LinkStorage;

    if (storageValue) {
        return;
    }

    if (linkData.type === LinkType.Unique) {
        const { targetDocumentUrl, targetUniqueSlug } = linkData;
        const { fullId, typeOrPart } =
            documentFsPathToContentId(targetDocumentUrl);

        const uniqueData = await ERUDIT.repository.prose.unique(
            fullId,
            typeOrPart,
            targetUniqueSlug,
        );

        storageValue = {
            type: LinkType.Unique,
            contentFullId: fullId,
            uniqueSlug: targetUniqueSlug,
            elementName: uniqueData.elementName,
            elementTitle: uniqueData.elementTitle,
            documentTitle: uniqueData.documentTitle,
            documentTypeOrPart: uniqueData.documentType,
            href: uniqueData.href,
        };

        storage[storageKey] = storageValue;
        return;
    }

    if (linkData.type === LinkType.Document) {
        const { fullId, typeOrPart } = documentFsPathToContentId(
            linkData.targetDocumentUrl,
        );

        const dbContentItem = await ERUDIT.db.query.content.findFirst({
            columns: {
                title: true,
            },
            where: eq(ERUDIT.db.schema.content.fullId, fullId),
        });

        if (!dbContentItem) {
            throw createError({
                statusCode: 404,
                statusMessage: `Content item with full ID "${fullId}" not found in database, but it is referenced by link to document "${linkData.targetDocumentUrl}"!`,
            });
        }

        const href = (() => {
            if (isTopicPart(typeOrPart)) {
                const topicPart = typeOrPart as TopicPart;
                return PAGES.topic(topicPart, fullId);
            }

            switch (typeOrPart) {
                case ContentType.Book:
                case ContentType.Group:
                case ContentType.Page:
                    return PAGES[typeOrPart](fullId);
            }

            throw createError({
                statusCode: 500,
                statusMessage: `Unable to create href for content item with full ID "${fullId}" of type or part "${typeOrPart}", referenced by link to document "${linkData.targetDocumentUrl}".`,
            });
        })();

        storageValue = {
            type: LinkType.Document,
            typeOrPart,
            contentFullId: fullId,
            title: dbContentItem.title,
            href,
        };

        storage[storageKey] = storageValue;
        return;
    }
}

function documentFsPathToContentId(documentFilePath: string) {
    const relativeFsContentPath = documentFilePath.replace(
        ERUDIT.config.paths.project + '/content/',
        '',
    );

    const pathParts = relativeFsContentPath.split('/');
    const typeOrPart = pathParts.pop()! as ContentType | TopicPart;
    const contentRelPath = pathParts.join('/')!;

    for (const navNode of ERUDIT.contentNav.id2Node.values()) {
        if (navNode.contentRelPath === contentRelPath) {
            return {
                fullId: navNode.fullId,
                shortId: navNode.shortId,
                typeOrPart,
            };
        }
    }

    throw createError({
        statusCode: 404,
        statusMessage: `Unable to find content with fs path "${documentFilePath}"!`,
    });
}
