import { ContentConfigGroup, ContentType } from '@erudit-js/cog/schema';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';
import { wrapError } from '../utils/error';

export const groupsParser: ContentParser = async () => {
    return {
        step: async (navNode: ContentNavNode) => {
            let groupModule: ContentConfigGroup | undefined;

            try {
                groupModule = await ERUDIT.import(
                    ERUDIT.config.paths.project +
                        '/content/' +
                        navNode.contentRelPath +
                        '/group',
                    { default: true, try: true },
                );
            } catch (error) {
                throw wrapError(error, 'Error importing group module!');
            }

            try {
                await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
                    fullId: navNode.fullId,
                    type: ContentType.Group,
                    title:
                        groupModule?.title || navNode.fullId.split('/').pop()!,
                    navTitle: groupModule?.navTitle,
                    description: groupModule?.description,
                });

                await ERUDIT.db.insert(ERUDIT.db.schema.groups).values({
                    fullId: navNode.fullId,
                    separator: groupModule?.type === 'separator',
                });
            } catch (error) {
                throw wrapError(error, 'Error inserting group content!');
            }
        },
    };
};
