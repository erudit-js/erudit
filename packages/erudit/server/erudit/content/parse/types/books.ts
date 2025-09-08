import { eq } from 'drizzle-orm';
import { ContentConfigBook, ContentType } from '@erudit-js/cog/schema';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';

export const booksParser: ContentParser = async () => {
    const contentTable = ERUDIT.db.schema.content;

    await ERUDIT.db
        .delete(contentTable)
        .where(eq(contentTable.type, ContentType.Book));

    return {
        step: async (navNode: ContentNavNode) => {
            let bookModule: ContentConfigBook | undefined;

            try {
                bookModule = await ERUDIT.import(
                    ERUDIT.config.paths.project +
                        '/content/' +
                        navNode.contentRelPath +
                        '/book',
                    { default: true },
                );
            } catch {}

            await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
                fullId: navNode.fullId,
                type: ContentType.Book,
                title: bookModule?.title || navNode.fullId.split('/').pop()!,
                navTitle: bookModule?.navTitle,
                description: bookModule?.description,
            });
        },
    };
};
