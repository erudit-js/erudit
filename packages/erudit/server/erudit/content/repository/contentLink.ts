import { getTopicParts } from './topicParts';

export async function getContentLink(fullId: string): Promise<string> {
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

    switch (navNode.type) {
        case 'book':
        case 'group':
        case 'page':
            return PAGES[navNode.type](navNode.shortId);
    }

    const topicParts = await getTopicParts(fullId);

    return PAGES.topic(topicParts[0], navNode.shortId);
}
