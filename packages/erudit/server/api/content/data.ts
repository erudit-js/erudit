import type { ContentGeneric } from '@shared/content/data/base';
import type { ContentTopicData } from '@shared/content/data/type/topic';
import type { ContentGroupData } from '@shared/content/data/type/group';
import type { ContentBookData } from '@shared/content/data/type/book';
import type { ContentGroupLike } from '@shared/content/data/groupLike';

import { getTopicPartsLinks } from '@server/repository/topic';
import { getContentBookFor } from '@server/repository/book';
import { getContentGenericData } from '@server/repository/content';
import { getFullContentId } from '@server/repository/contentId';
import { getQuickLinks } from '@server/repository/quickLink';
import { getContentToc } from '@server/repository/contentToc';
import { getContentSourceUsageSet } from '@server/repository/reference';
import { getReadLink } from '@server/repository/readLink';
import { getElementStats } from '@server/repository/elementStats';
import { countTopicsIn } from '@server/repository/topicCount';

export default defineEventHandler(async (event) => {
    let contentId = getQuery(event)?.contentId as string;
    contentId = getFullContentId(contentId);

    if (!contentId) {
        throw createError({
            statusCode: 400,
            statusText: 'Missing content ID!',
        });
    }

    const generic = await getContentGenericData(contentId);

    switch (generic.type) {
        case 'topic':
            return await getTopicData(generic);
        case 'group':
            return await getGroupData(generic);
        case 'book':
            return await getBookData(generic);
    }

    throw createError({
        statusCode: 400,
        statusText: `Unknown content data type "${generic.type}"!`,
    });
});

//
//
//

async function getTopicData(
    generic: ContentGeneric,
): Promise<ContentTopicData> {
    const contentBook = await getContentBookFor(generic.contentId);

    return {
        type: 'topic',
        generic,
        bookTitle: contentBook?.title,
        topicPartLinks: await getTopicPartsLinks(generic.contentId),
        quickLinks: await getQuickLinks(generic.contentId),
    };
}

async function getGroupData(
    generic: ContentGeneric,
): Promise<ContentGroupData> {
    const contentBook = await getContentBookFor(generic.contentId);

    return {
        type: 'group',
        generic,
        groupLike: await getGroupLikeData(generic.contentId),
        bookTitle: contentBook?.title,
    };
}

async function getBookData(generic: ContentGeneric): Promise<ContentBookData> {
    return {
        type: 'book',
        generic,
        groupLike: await getGroupLikeData(generic.contentId),
    };
}

//
//
//

async function getGroupLikeData(contentId: string): Promise<ContentGroupLike> {
    return {
        contentToc: await getContentToc(contentId),
        readLink: await getReadLink(contentId),
        topicCount: await countTopicsIn(contentId),
        elementStats: await getElementStats(contentId),
        sourceUsageSet: await getContentSourceUsageSet(contentId),
    };
}
