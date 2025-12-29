import { and, eq } from 'drizzle-orm';

export async function getContentQuickLinks(
    fullId: string,
): Promise<QuickLink[] | undefined> {
    const quickLinks: QuickLink[] = [];

    const dbQuickLinks = await ERUDIT.db.query.contentSnippets.findMany({
        columns: {
            contentProseType: true,
            schemaName: true,
            elementId: true,
            title: true,
            description: true,
        },
        where: and(
            eq(ERUDIT.db.schema.contentSnippets.contentFullId, fullId),
            eq(ERUDIT.db.schema.contentSnippets.quick, true),
        ),
    });

    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

    for (const dbQuickLink of dbQuickLinks) {
        const link = (() => {
            if (dbQuickLink.contentProseType === 'page') {
                return PAGES.page(navNode.shortId, dbQuickLink.elementId);
            }

            return PAGES.topic(
                dbQuickLink.contentProseType,
                navNode.shortId,
                dbQuickLink.elementId,
            );
        })();

        const quickLink: QuickLink = {
            link,
            schemaName: dbQuickLink.schemaName,
            title: dbQuickLink.title,
        };

        if (dbQuickLink.description) {
            quickLink.description = dbQuickLink.description;
        }

        quickLinks.push(quickLink);
    }

    return quickLinks.length > 0 ? quickLinks : undefined;
}
