import { Like } from 'typeorm';

import { DbTopic } from '@server/db/entities/Topic';
import { ERUDIT_SERVER } from '@server/global';
import { getFullContentId } from '@server/repository/contentId';

export async function countTopicsIn(mixedContentId: string) {
    const fullContentId = getFullContentId(mixedContentId);
    return await ERUDIT_SERVER.DB.manager.count(DbTopic, {
        where: [
            { contentId: fullContentId },
            { contentId: Like(`${fullContentId}/%`) },
        ],
    });
}

export async function countAllTopics() {
    return await ERUDIT_SERVER.DB.manager.count(DbTopic);
}
