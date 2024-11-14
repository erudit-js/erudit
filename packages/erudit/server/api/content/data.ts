import { getTopicPartsLinks } from '@server/repository/topic';
import { getContentBookFor } from '@server/repository/book';
import { getContentGenericData } from '@server/repository/content';

import type { ContentGenericData } from '@shared/content/data/base';
import type { ContentTopicData } from '@shared/content/data/type/topic';
import type { ContentGroupData } from '@shared/content/data/type/group';
import type { ContentBookData } from '@shared/content/data/type/book';

export default defineEventHandler(async (event) => {
    const contentId = getQuery(event)?.contentId as string;

    if (!contentId)
        throw createError({
            statusCode: 400,
            statusText: 'Missing content ID!',
        });

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
    generic: ContentGenericData,
): Promise<ContentTopicData> {
    const contentBook = await getContentBookFor(generic.contentId);

    return {
        type: 'topic',
        generic,
        bookTitle: contentBook?.title,
        topicPartLinks: await getTopicPartsLinks(generic.contentId),
    };
}

async function getGroupData(
    generic: ContentGenericData,
): Promise<ContentGroupData> {
    const contentBook = await getContentBookFor(generic.contentId);

    return {
        type: 'group',
        generic,
        bookTitle: contentBook?.title,
    };
}

async function getBookData(
    generic: ContentGenericData,
): Promise<ContentBookData> {
    return {
        type: 'book',
        generic,
    };
}
