import type { ContentItem } from '@erudit-js/core/content/item';

import type { ContentNavNode } from '../../nav/types';

export async function insertContentItem(
    navNode: ContentNavNode,
    contentItem: ContentItem,
) {
    await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
        fullId: navNode.fullId,
        type: navNode.type,
        title: contentItem.title || navNode.fullId.split('/').pop()!,
        navTitle: contentItem.navTitle,
        description: contentItem.description,
        hidden: Boolean(contentItem.hidden) || false,
        flags: contentItem.flags,
    });
}
