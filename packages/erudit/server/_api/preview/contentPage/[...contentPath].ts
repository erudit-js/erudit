import { eq } from 'drizzle-orm';

import { ContentType, isTopicPart, TopicPart } from '@erudit-js/cog/schema';

export default defineEventHandler<Promise<PreviewContentPage>>(
    async (event) => {
        // <typeOrPart>/<fullContentId>.json
        const contentPath = event.context.params!.contentPath.slice(0, -5);

        const { typeOrPart, fullOrShortId: fullId } =
            parseContentPath(contentPath);

        const dbContent = (await ERUDIT.db.query.content.findFirst({
            columns: {
                title: true,
                description: true,
            },
            where: eq(ERUDIT.db.schema.content.fullId, fullId),
        }))!;

        const bookNavNode = ERUDIT.contentNav.getBookFor(fullId);
        let bookTitle: string | undefined;

        if (bookNavNode) {
            if (bookNavNode.fullId !== fullId) {
                const dbBook = (await ERUDIT.db.query.content.findFirst({
                    columns: {
                        title: true,
                    },
                    where: eq(
                        ERUDIT.db.schema.content.fullId,
                        bookNavNode.fullId,
                    ),
                }))!;

                bookTitle = dbBook.title;
            }
        }

        const link = (() => {
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
        })()!;

        return {
            type: isTopicPart(typeOrPart) ? ContentType.Topic : typeOrPart,
            topicPart: isTopicPart(typeOrPart)
                ? (typeOrPart as TopicPart)
                : undefined,
            title: dbContent.title,
            description: dbContent.description ?? undefined,
            bookTitle,
            link,
        };
    },
);
