import { ContentConfigGroup } from '@erudit-js/cog/schema';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';
import { wrapError } from '../utils/error';
import { insertContentConfig } from '../utils/contentConfig';

export const groupsParser: ContentParser = async () => {
    return {
        step: async (navNode: ContentNavNode) => {
            let groupModule: { default: ContentConfigGroup } | undefined;

            try {
                groupModule = await ERUDIT.import(
                    ERUDIT.config.paths.project +
                        '/content/' +
                        navNode.contentRelPath +
                        '/group',
                    { try: true },
                );
            } catch (error) {
                throw wrapError(error, 'Error importing group module!');
            }

            try {
                await insertContentConfig(navNode, groupModule?.default);

                await ERUDIT.db.insert(ERUDIT.db.schema.groups).values({
                    fullId: navNode.fullId,
                    separator: groupModule?.default.type === 'separator',
                });
            } catch (error) {
                throw wrapError(error, 'Error inserting group content!');
            }
        },
    };
};
