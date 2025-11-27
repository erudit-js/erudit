import { eq } from 'drizzle-orm';
import { ContentType } from '@erudit-js/cog/schema';
import { headingSchema } from '@erudit-js/prose/elements/heading/core';

export async function searchIndexContentTypes(): Promise<SearchEntriesList[]> {
    const entryLists: SearchEntriesList[] = [];

    for (const contentType of Object.values(ContentType)) {
        const dbContentItems = await ERUDIT.db.query.content.findMany({
            columns: {
                fullId: true,
                title: true,
                description: true,
                type: true,
            },
            where: (fields) => eq(fields.type, contentType),
        });

        entryLists.push({
            category: {
                id: contentType,
                priority: 200,
            },
            entries: await Promise.all(
                dbContentItems.map(async (dbContentItem) => {
                    const bookTitle: string | undefined = await (async () => {
                        if (dbContentItem.type === ContentType.Book) {
                            return undefined;
                        }

                        const itemBook = ERUDIT.contentNav.getBookFor(
                            dbContentItem.fullId,
                        );

                        if (itemBook) {
                            const bookId = itemBook.fullId;
                            const dbBook =
                                await ERUDIT.db.query.content.findFirst({
                                    columns: { title: true },
                                    where: eq(
                                        ERUDIT.db.schema.content.fullId,
                                        bookId,
                                    ),
                                });
                            return dbBook?.title;
                        }
                    })();

                    return {
                        category: contentType,
                        title: dbContentItem.title,
                        description: dbContentItem.description || undefined,
                        link: await ERUDIT.repository.content.link(
                            dbContentItem.fullId,
                        ),
                        location: bookTitle,
                    } satisfies SearchEntry;
                }),
            ),
        });
    }

    return entryLists;
}

export async function searchIndexSnippets(): Promise<SearchEntriesList[]> {
    const entryLists: Map<string, SearchEntriesList> = new Map();

    const dbSnippets = await ERUDIT.db.query.snippets.findMany({
        where: eq(ERUDIT.db.schema.snippets.search, true),
    });

    for (const dbSnippet of dbSnippets) {
        if (!entryLists.has(dbSnippet.elementName)) {
            entryLists.set(dbSnippet.elementName, {
                category: {
                    id: 'element:' + dbSnippet.elementName,
                    priority:
                        dbSnippet.elementName === headingSchema.name
                            ? 325
                            : 350,
                },
                entries: [],
            });
        }

        const navNode = ERUDIT.contentNav.getNodeOrThrow(
            dbSnippet.contentFullId,
        );
        let link: string;

        const locationTitle = await (async () => {
            const dbContentItem = await ERUDIT.db.query.content.findFirst({
                columns: { title: true },
                where: eq(
                    ERUDIT.db.schema.content.fullId,
                    dbSnippet.contentFullId,
                ),
            });

            return dbContentItem?.title;
        })();

        switch (navNode.type) {
            case ContentType.Page:
                link = PAGES[navNode.type](navNode.shortId, dbSnippet.domId);
                break;
            case ContentType.Topic:
                link = PAGES[navNode.type](
                    dbSnippet.topicPart!,
                    navNode.shortId,
                    dbSnippet.domId,
                );
                break;
            default:
                throw createError({
                    statusCode: 500,
                    statusMessage: `Cannot create search snippet link for content type "${navNode.type}"!`,
                });
        }

        entryLists.get(dbSnippet.elementName)!.entries.push({
            category: 'element:' + dbSnippet.elementName,
            title: dbSnippet.title,
            description: dbSnippet.description || undefined,
            link,
            location: locationTitle,
            synonyms: dbSnippet.synonyms || undefined,
        });
    }

    return Array.from(entryLists.values());
}
