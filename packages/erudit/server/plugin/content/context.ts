import { isContentType, isTopicPart, type TopicPart } from 'erudit-cog/schema';

import { ERUDIT_SERVER } from '@server/global';
import { getIdsUp, isSkipId } from '@server/nav/utils';
import { DbContent } from '@server/db/entities/Content';
import { DbContributor } from '@server/db/entities/Contributor';

import type { Context } from '@shared/content/context';
import {
    createContentLink,
    createContributorLink,
    createTopicPartLink,
} from '@shared/link';
import { CONTENT_TYPE_ICON, ICON, TOPIC_PART_ICON } from '@erudit/shared/icons';
import type { BitranLocation } from '@erudit/shared/bitran/location';

export async function getContentContext(contentId: string): Promise<Context> {
    const context: Context = [];

    for (const _contentId of (await getIdsUp(contentId)).reverse()) {
        const dbContent = await getDbContent(_contentId);

        context.push({
            type: ERUDIT_SERVER.LANGUAGE.phrases[dbContent.type],
            icon: isTopicPart(dbContent.type)
                ? TOPIC_PART_ICON[dbContent.type]
                : isContentType(dbContent.type)
                  ? CONTENT_TYPE_ICON[dbContent.type]
                  : '',
            title: dbContent.title || dbContent.contentId,
            href: createContentLink(dbContent.type, dbContent.contentId),
            hidden: await isSkipId(dbContent.contentId),
        });
    }

    return context;
}

export async function getTopicPartContext(
    topicPart: TopicPart,
    contentId: string,
): Promise<Context> {
    const context = await getContentContext(contentId);
    const topicItem = context.pop()!;

    topicItem.type = ERUDIT_SERVER.LANGUAGE.phrases[topicPart];
    topicItem.icon = TOPIC_PART_ICON[topicPart];
    topicItem.href = createTopicPartLink(topicPart, contentId);

    return context.concat([topicItem]);
}

export async function getContributorContext(
    contributorId: string,
): Promise<Context> {
    const dbContributor = await ERUDIT_SERVER.DB.manager.findOne(
        DbContributor,
        {
            select: ['displayName'],
            where: { contributorId },
        },
    );

    if (!dbContributor)
        throw new Error(`Contributor "${contributorId}" not found!`);

    return [
        {
            type: ERUDIT_SERVER.LANGUAGE.phrases.contributor,
            icon: ICON.contributor,
            title: dbContributor.displayName || contributorId,
            href: createContributorLink(contributorId),
            hidden: false,
        },
    ];
}

export async function getLocationContext(
    location: BitranLocation,
): Promise<Context> {
    const contentId = location.path!;

    switch (location.type) {
        case 'article':
        case 'summary':
        case 'practice':
            return await getTopicPartContext(location.type, contentId);
        case 'group':
            return await getContentContext(contentId);
        case 'contributor':
            return await getContributorContext(contentId);
    }

    throw new Error(
        `Cant' build context for location unknown type "${location.type}"!`,
    );
}

//
//
//

async function getDbContent(contentId: string): Promise<DbContent> {
    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['type', 'title', 'fullId', 'contentId'],
        where: { contentId },
    });

    if (!dbContent) throw new Error(`Content "${contentId}" not found!`);

    return dbContent;
}
