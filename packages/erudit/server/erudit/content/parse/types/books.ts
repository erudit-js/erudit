import { ContentConfigBook } from '@erudit-js/cog/schema';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';
import { wrapError } from '../utils/error';
import { insertContentConfig } from '../utils/contentConfig';

export const booksParser: ContentParser = async () => {
    return {
        step: async (navNode: ContentNavNode) => {
            let bookModule: { default: ContentConfigBook } | undefined;

            try {
                bookModule = await ERUDIT.import(
                    ERUDIT.config.paths.project +
                        '/content/' +
                        navNode.contentRelPath +
                        '/book',
                    { try: true },
                );
            } catch (error) {
                throw wrapError(error, 'Error importing book module!');
            }

            try {
                await insertContentConfig(navNode, bookModule?.default);
            } catch (error) {
                throw wrapError(error, 'Error inserting book content!');
            }
        },
    };
};
