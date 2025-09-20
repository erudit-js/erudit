import { ContentConfigBook, ContentType } from '@erudit-js/cog/schema';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';

export const booksParser: ContentParser = async () => {
    return {
        step: async (navNode: ContentNavNode) => {
            let bookModule: ContentConfigBook | undefined;

            try {
                bookModule = await ERUDIT.import(
                    ERUDIT.config.paths.project +
                        '/content/' +
                        navNode.contentRelPath +
                        '/book',
                    { default: true, try: true },
                );
            } catch (error) {
                throw 'Error importing book module: ' + error;
            }

            try {
                await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
                    fullId: navNode.fullId,
                    type: ContentType.Book,
                    title:
                        bookModule?.title || navNode.fullId.split('/').pop()!,
                    navTitle: bookModule?.navTitle,
                    description: bookModule?.description,
                });
            } catch (error) {
                throw 'Error inserting book content: ' + error;
            }
        },
    };
};
