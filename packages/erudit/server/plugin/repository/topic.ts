import type { TopicPart } from '@erudit-js/cog/schema';

import { ERUDIT_SERVER } from '@server/global';
import { DbTopic } from '@server/db/entities/Topic';
import { getShortContentId } from '@server/repository/contentId';

import type { TopicPartLinks } from '@shared/content/data/type/topic';
import { createTopicPartLink } from '@shared/link';

export async function getTopicParts(contentId: string) {
    const dbTopic = await ERUDIT_SERVER.DB.manager.findOne(DbTopic, {
        select: ['parts'],
        where: { contentId },
    });

    if (!dbTopic) throw new Error(`Missing topic "${contentId}".`);

    return dbTopic.parts;
}

export async function getTopicPart(contentId: string): Promise<TopicPart> {
    const topicParts = await getTopicParts(contentId);
    return topicParts.shift()!;
}

export async function getTopicPartsLinks(topicId: string) {
    const existingTopicParts = await getTopicParts(topicId);
    const shortTopicId = await getShortContentId(topicId);
    const links: TopicPartLinks = {};

    for (const topicPart of existingTopicParts)
        links[topicPart] = createTopicPartLink(topicPart, shortTopicId);

    return links;
}
