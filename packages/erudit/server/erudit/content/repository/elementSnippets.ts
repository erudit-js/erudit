import { and, asc, eq, or } from 'drizzle-orm';

export async function getContentElementSnippets(
    fullId: string,
): Promise<ElementSnippet[] | undefined> {
    const snippets: ElementSnippet[] = [];

    const dbSnippets = await ERUDIT.db.query.contentSnippets.findMany({
        columns: {
            contentProseType: true,
            schemaName: true,
            elementId: true,
            title: true,
            description: true,
            quick: true,
            seo: true,
        },
        where: and(
            eq(ERUDIT.db.schema.contentSnippets.contentFullId, fullId),
            or(
                eq(ERUDIT.db.schema.contentSnippets.quick, true),
                eq(ERUDIT.db.schema.contentSnippets.seo, true),
            ),
        ),
        orderBy: (snippets) => asc(snippets.snippetId),
    });

    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

    for (const dbSnippet of dbSnippets) {
        const link = (() => {
            if (dbSnippet.contentProseType === 'page') {
                return PAGES.page(navNode.shortId, dbSnippet.elementId);
            }

            return PAGES.topic(
                dbSnippet.contentProseType,
                navNode.shortId,
                dbSnippet.elementId,
            );
        })();

        const snippet: ElementSnippet = {
            link,
            schemaName: dbSnippet.schemaName,
            title: dbSnippet.title,
        };

        if (dbSnippet.quick) {
            snippet.quick = true;
        }

        if (dbSnippet.seo) {
            snippet.seo = true;
        }

        if (dbSnippet.description) {
            snippet.description = dbSnippet.description;
        }

        snippets.push(snippet);
    }

    return snippets.length > 0 ? snippets : undefined;
}
