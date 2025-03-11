import { existsSync, readFileSync } from 'node:fs';
import { topicParts, type TopicPart } from '@erudit-js/cog/schema';

import { ERUDIT_SERVER } from '@server/global';
import { DbTopic } from '@server/db/entities/Topic';
import type { BuilderFunctionArgs } from '../builderArgs';
import { contentItemPath } from '../path';
import { parseBitranContent } from '../parse';

export async function buildTopic({ navNode }: BuilderFunctionArgs) {
    const dbTopic = new DbTopic();
    dbTopic.contentId = navNode.id;
    const existingTopicParts: TopicPart[] = [];

    for (const topicPart of topicParts) {
        const partPath = contentItemPath(navNode, `${topicPart}.bi`);
        const strContent =
            existsSync(partPath) && readFileSync(partPath, 'utf-8');

        if (strContent === false) continue;

        existingTopicParts.push(topicPart);
        dbTopic[topicPart] = strContent;

        await parseBitranContent(
            {
                type: topicPart,
                path: navNode.id,
            },
            strContent,
        );
    }

    dbTopic.parts = existingTopicParts;
    await ERUDIT_SERVER.DB.manager.save(dbTopic);
}
