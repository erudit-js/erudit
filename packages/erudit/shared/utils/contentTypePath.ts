import { type TopicPart, isTopicPart } from '@erudit-js/core/content/topic';
import { type ContentType, isContentType } from '@erudit-js/core/content/type';

interface OtherContentTypePath {
    type: 'book' | 'group' | 'page';
    contentId: string;
}

interface TopicContentTypePath {
    type: 'topic';
    topicPart: TopicPart;
    contentId: string;
}

export type ContentTypePath = OtherContentTypePath | TopicContentTypePath;

export function parseContentTypePath(contentPath: string): ContentTypePath {
    const contentPathArray = contentPath.split('/');
    const typeOrPart = contentPathArray.shift();

    if (!isTopicPart(typeOrPart) && !isContentType(typeOrPart)) {
        throw createError({
            status: 400,
            statusMessage: `Invalid content path type/topic part: "${contentPath}"!`,
        });
    }

    if (typeOrPart === 'topic') {
        throw createError({
            status: 400,
            statusMessage: `Instead of "topic", use specific topic part (article, summary or practice) in content path: "${contentPath}"!`,
        });
    }

    const fullOrShortId = contentPathArray.join('/');

    if (!fullOrShortId) {
        throw createError({
            status: 400,
            statusMessage: `Falsy content path full/short ID: "${contentPath}"!`,
        });
    }

    if (isTopicPart(typeOrPart)) {
        return {
            type: 'topic',
            topicPart: typeOrPart,
            contentId: fullOrShortId,
        };
    }

    return {
        type: typeOrPart,
        contentId: fullOrShortId,
    };
}

export function stringifyContentTypePath(
    typeOrPart: Omit<ContentType | TopicPart, 'topic'>,
    fullOrShortId: string,
): string {
    return `${typeOrPart}/${fullOrShortId}`;
}
