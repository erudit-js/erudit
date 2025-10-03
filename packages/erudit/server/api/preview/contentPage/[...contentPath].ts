import { eq } from 'drizzle-orm';
import { ContentType, TopicPart } from '@erudit-js/cog/schema';

export default defineEventHandler<Promise<PreviewContentPage>>(
    async (event) => {
        const contentPath = event.context.params!.contentPath;
        const { typeOrPart, shortId } = parseContentPath(contentPath);
        const contentNavNode = ERUDIT.contentNav.getNodeOrThrow(shortId);

        let topicPart: TopicPart | undefined;
        if (contentNavNode.type === ContentType.Topic) {
            topicPart = typeOrPart as TopicPart;
        }

        const dbContent = (await ERUDIT.db.query.content.findFirst({
            columns: {
                title: true,
                description: true,
            },
            where: eq(ERUDIT.db.schema.content.fullId, contentNavNode.fullId),
        }))!;

        const bookNavNode = ERUDIT.contentNav.getBookFor(shortId);
        let bookTitle: string | undefined;

        if (bookNavNode) {
            if (bookNavNode.shortId !== shortId) {
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
            switch (contentNavNode.type) {
                case ContentType.Book:
                case ContentType.Group:
                case ContentType.Page:
                    return PAGES[contentNavNode.type](shortId);
                case ContentType.Topic:
                    return PAGES.topic(topicPart!, shortId);
            }
        })();

        return {
            type: contentNavNode.type,
            topicPart,
            title: dbContent.title,
            description: dbContent.description ?? undefined,
            bookTitle,
            link,
        };
    },
);
