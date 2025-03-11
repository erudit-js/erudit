import { isTopicPart } from '@erudit-js/cog/schema';

import {
    parseBitranLocation,
    stringifyBitranLocation,
    type BitranLocation,
} from '@shared/bitran/location';
import { getNavBookOf } from '../nav/utils';

export function toAbsoluteContentLocation<T extends string | BitranLocation>(
    location: T,
    contextContentId: string,
): T {
    const isLocationStr = typeof location === 'string';
    const parsedLocation = isLocationStr
        ? parseBitranLocation(location)
        : (location as BitranLocation);

    if (
        isTopicPart(parsedLocation.type) ||
        ['book', 'group', 'topic'].includes(parsedLocation.type)
    ) {
        parsedLocation.path = toAbsoluteContentId(
            parsedLocation.path!,
            contextContentId,
        );
        return (
            isLocationStr
                ? stringifyBitranLocation(parsedLocation)
                : parsedLocation
        ) as T;
    }

    return location;
}

export function toAbsoluteContentId(
    path: string,
    contextContentId: string = '',
) {
    const fullPath = (() => {
        if (path.startsWith('..'))
            return (contextContentId ? contextContentId + '/' : '') + path;

        if (path.startsWith('.'))
            return trimEdgeSlashes(contextContentId + path.substring(1));

        if (path.startsWith('~'))
            return trimEdgeSlashes(
                tryGetParentBook(contextContentId) + path.substring(1),
            );

        return path;
    })();

    const reversePathParts = fullPath.split('/').reverse();
    const finalParts: string[] = [];

    let skipCounter = 0;

    for (let i = 0; i < reversePathParts.length; i++) {
        const part = reversePathParts[i];

        if (part === '..') {
            skipCounter++;
            continue;
        }

        if (skipCounter) {
            skipCounter--;
            continue;
        }

        finalParts.unshift(part!);
    }

    return finalParts.join('/');
}

function trimEdgeSlashes(path: string) {
    if (path.startsWith('/')) path = path.substring(1);

    if (path.endsWith('/')) path = path.substring(0, path.length - 1);

    return path;
}

function tryGetParentBook(contentId: string): string {
    const navBook = getNavBookOf(contentId);

    if (!navBook) return '';

    return navBook.id;
}
