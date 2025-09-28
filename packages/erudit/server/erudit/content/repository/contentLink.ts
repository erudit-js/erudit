import { ContentType } from '@erudit-js/cog/schema';

import { getTopicParts } from './topicParts';

export async function getContentLink(fullId: string): Promise<string> {
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

    switch (navNode.type) {
        case ContentType.Book:
        case ContentType.Group:
        case ContentType.Page:
            return PAGES[navNode.type](navNode.shortId);
    }

    const topicParts = await getTopicParts(fullId);

    return PAGES.topic(topicParts[0], navNode.shortId);
}
