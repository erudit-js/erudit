import {
    isContentType,
    isTopicPart,
    type ContentType,
    type TopicPart,
} from '@erudit-js/cog/schema';

export function parseContentPath(contentPath: string): {
    typeOrPart: ContentType | TopicPart;
    shortId: string;
} {
    const contentPathArray = contentPath.split('/');
    const typeOrPart = contentPathArray.shift();

    if (!isTopicPart(typeOrPart) && !isContentType(typeOrPart)) {
        throw createError({
            status: 400,
            statusMessage: `Invalid content path type/topic part: "${contentPath}"!`,
        });
    }

    const shortId = contentPathArray.join('/');

    if (!shortId) {
        throw createError({
            status: 400,
            statusMessage: `Falsy content path short ID: "${contentPath}"!`,
        });
    }

    return {
        typeOrPart,
        shortId,
    };
}

export function createContentPath(
    typeOrPart: ContentType | TopicPart,
    shortId: string,
): string {
    return `${typeOrPart}/${shortId}`;
}
