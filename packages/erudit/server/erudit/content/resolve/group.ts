import type { GroupContentItem } from '@erudit-js/core/content/group';
import { isContentItem } from '@erudit-js/core/content/item';

import type { ContentNavNode } from '../nav/types';
import { logContentError } from './utils/contentError';
import { insertContentItem } from './utils/insertContentItem';

export async function resolveGroup(groupNode: ContentNavNode) {
    ERUDIT.log.debug.start(
        `Resolving group ${ERUDIT.log.stress(groupNode.fullId)}...`,
    );

    try {
        const groupModule = await ERUDIT.import<{ default: GroupContentItem }>(
            ERUDIT.config.paths.project +
                '/content/' +
                groupNode.contentRelPath +
                '/group',
        );

        if (!isContentItem<GroupContentItem>(groupModule?.default, 'group')) {
            throw new Error(
                'Group default export must be a group content item!',
            );
        }

        const groupContentItem = groupModule.default;

        await insertContentItem(groupNode, groupContentItem);

        await ERUDIT.db.insert(ERUDIT.db.schema.groups).values({
            fullId: groupNode.fullId,
            separator: groupContentItem.separator ?? false,
        });
    } catch (error) {
        logContentError(groupNode);
        throw error;
    }
}
