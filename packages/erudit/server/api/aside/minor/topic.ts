import type { TopicPart } from '@erudit-js/cog/schema';

import { getBitranToc } from '@server/bitran/toc';
import {
    getAsideMinorContentBase,
    getAsideMinorContentNode,
} from '@server/repository/asideMinor';
import { getTopicPartsLinks } from '@server/repository/topic';

import type { AsideMinorTopic } from '@erudit/shared/aside/minor';

export default defineEventHandler(async (event) => {
    const query = getQuery<{ topicId: string; topicPart: TopicPart }>(event);
    const topicNavNode = getAsideMinorContentNode('topic', query.topicId);
    const topicPart = query.topicPart;

    if (!topicPart) {
        throw createError({
            statusCode: 400,
            statusText: 'Missing "topicPart" query parameter!',
        });
    }

    const toc = await getBitranToc({
        type: topicPart,
        path: topicNavNode.fullId,
    });

    return {
        type: 'topic',
        toc,
        part: topicPart,
        partLinks: await getTopicPartsLinks(topicNavNode.fullId),
        ...(await getAsideMinorContentBase(topicNavNode)),
    } satisfies AsideMinorTopic;
});
