import { type TopicPart, isTopicPart } from '@erudit-js/core/content/topic';
import { type ContentType, isContentType } from '@erudit-js/core/content/type';

export function parseContentPath(contentPath: string): {
    typeOrPart: ContentType | TopicPart;
    fullOrShortId: string;
} {
    const contentPathArray = contentPath.split('/');
    const typeOrPart = contentPathArray.shift();

    if (!isTopicPart(typeOrPart) && !isContentType(typeOrPart)) {
        throw createError({
            status: 400,
            statusMessage: `Invalid content path type/topic part: "${contentPath}"!`,
        });
    }

    const fullOrShortId = contentPathArray.join('/');

    if (!fullOrShortId) {
        throw createError({
            status: 400,
            statusMessage: `Falsy content path full/short ID: "${contentPath}"!`,
        });
    }

    return {
        typeOrPart,
        fullOrShortId,
    };
}

export function createContentPath(
    typeOrPart: ContentType | TopicPart,
    fullOrShortId: string,
): string {
    return `${typeOrPart}/${fullOrShortId}`;
}
