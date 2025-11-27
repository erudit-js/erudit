import { eq, and } from 'drizzle-orm';

import { ContentType, type TopicPart } from '@erudit-js/cog/schema';
import type { ElementSchemaAny, ParsedElement } from '@erudit-js/prose';

export interface UniqueData {
    href: string;
    documentType: ContentType | TopicPart;
    documentTitle: string;
    elementTitle?: string;
    elementName: string;
    element: ParsedElement<ElementSchemaAny>;
}

export async function getUniqueData(
    contentFullId: string,
    typeOrPart: ContentType | TopicPart,
    uniqueSlug: string,
): Promise<UniqueData> {
    const dbUnique = await ERUDIT.db.query.uniques.findFirst({
        columns: {
            contentFullId: true,
            parsedElement: true,
            domId: true,
        },
        where: and(
            eq(ERUDIT.db.schema.uniques.contentFullId, contentFullId),
            eq(ERUDIT.db.schema.uniques.typeOrPart, typeOrPart),
            eq(ERUDIT.db.schema.uniques.uniqueSlug, uniqueSlug),
        ),
    });

    if (!dbUnique) {
        throw createError({
            statusCode: 404,
            statusMessage: `Unique with slug "${uniqueSlug}" in content "${contentFullId}" not found in database!`,
        });
    }

    const dbContentItem = await ERUDIT.db.query.content.findFirst({
        columns: {
            title: true,
        },
        where: eq(ERUDIT.db.schema.content.fullId, dbUnique.contentFullId),
    });

    if (!dbContentItem) {
        throw createError({
            statusCode: 500,
            statusMessage: `Content item with full ID "${dbUnique.contentFullId}" not found in database, but it is referenced by unique "${uniqueSlug}"! This should not be possible.`,
        });
    }

    const contentNavNode = ERUDIT.contentNav.getNodeOrThrow(
        dbUnique.contentFullId,
    );

    const isTopic = contentNavNode.type === ContentType.Topic;

    const href = (() => {
        if (isTopic) {
            return PAGES.topic(
                typeOrPart as TopicPart,
                contentNavNode.shortId,
                dbUnique.domId,
            );
        }

        if (contentNavNode.type === ContentType.Page) {
            return PAGES.page(contentNavNode.shortId, dbUnique.domId);
        }

        throw createError({
            statusCode: 500,
            statusMessage: `Unable to create href for content item with full ID "${dbUnique.contentFullId}" of type "${contentNavNode.type}", referenced by unique "${uniqueSlug}".`,
        });
    })();

    return {
        href,
        documentType: typeOrPart,
        documentTitle: dbContentItem.title,
        elementTitle: dbUnique.parsedElement.title,
        elementName: dbUnique.parsedElement.name,
        element: dbUnique.parsedElement,
    };
}
