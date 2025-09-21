import { eq } from 'drizzle-orm';
import { ContentType } from '@erudit-js/cog/schema';

export const searchContentTypeCategories = Object.values(ContentType).reduce(
    (acc, contentType) => ({
        ...acc,
        [contentType]: {
            id: contentType,
            priority: 200,
        } as SearchEntryCategory,
    }),
    {} as Record<ContentType, SearchEntryCategory>,
);

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
            category: searchContentTypeCategories[contentType],
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
