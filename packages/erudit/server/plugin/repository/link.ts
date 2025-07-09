import { getNavNode } from '@server/nav/utils';
import {
    createContentLink as _createContentLink,
    createTopicPartLink,
} from '@shared/link';
import { getTopicParts } from './topic';

export async function createContentLink(
    mixedContentId: string,
): Promise<string> {
    const navNode = getNavNode(mixedContentId);

    if (navNode.type === 'topic') {
        const parts = await getTopicParts(navNode.fullId);
        const part = parts.shift()!;
        return createTopicPartLink(part, navNode.shortId);
    }

    return _createContentLink(navNode.type, navNode.shortId);
}
