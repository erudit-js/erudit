import { isTopicPart, locationFromPath } from '@erudit-js/cog/schema';

import type { AsideMinorContent, AsideMinorTopic } from '@shared/aside/minor';
import { getBitranToc } from '@erudit/server/plugin/bitran/toc';
import {
    getContentContributors,
    getFullContentId,
    getPreviousNext,
} from '@erudit/server/plugin/repository/content';
import { getTopicPartsLinks } from '@erudit/server/plugin/repository/topic';

export default defineEventHandler(async (event) => {
    const query = getQuery<{ path: string }>(event);

    if (!query.path)
        throw createError({
            statusCode: 400,
            statusText: 'Missing "path" query parameter!',
        });

    const path = query.path.substring(1);
    const pathStart = path.split('/')[0];

    if (isTopicPart(pathStart)) return await createTopicData(path);

    if (['book', 'group'].includes(pathStart))
        return await createContentData(pathStart, path);

    return 'news';
});

async function createTopicData(path: string): Promise<AsideMinorTopic> {
    const location = locationFromPath(path);

    if (!location)
        throw createError({
            statusCode: 400,
            statusText: `Provided path "${path}" is not a valid topic location!`,
        });

    const contentId = location.path;
    const fullContentId = (await getFullContentId(contentId))!;

    const toc = await getBitranToc(location);
    const previousNext = await getPreviousNext(contentId);
    const topicPartsLinks = await getTopicPartsLinks(contentId);
    const contributors = await getContentContributors(contentId);

    return {
        type: 'topic',
        fullContentId,
        location,
        toc,
        nav: {
            ...previousNext,
            ...topicPartsLinks,
        },
        contributors,
    };
}

async function createContentData(
    type: string,
    path: string,
): Promise<AsideMinorContent> {
    const contentId = path.split('/').slice(1).join('/');
    const fullContentId = (await getFullContentId(contentId))!;
    const previousNext = await getPreviousNext(contentId);
    const contributors = await getContentContributors(contentId);

    return {
        type: type as any,
        fullContentId,
        nav: previousNext,
        contributors,
    };
}
