import {
    isContentType,
    parseBitranLocation,
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit-js/cog/schema';

export function toAbsoluteLocation<T extends string | BitranLocation>(
    location: T,
    contextId: string,
    bookIds?: string[],
) {
    const isStringLocation = typeof location === 'string';
    const parsedLocation = isStringLocation
        ? parseBitranLocation(location)
        : (location as BitranLocation);

    if (isContentType(parsedLocation.type)) {
        parsedLocation.path = toAbsoluteContentId(
            parsedLocation.path!,
            contextId,
            bookIds,
        );
        return (
            isStringLocation
                ? stringifyBitranLocation(parsedLocation)
                : parsedLocation
        ) as T;
    }

    return location;
}

export function toAbsoluteContentId(
    contentId: string,
    contextId: string,
    bookIds?: string[],
) {
    const unresolvedPath = (() => {
        if (contentId.startsWith('/')) {
            return contentId;
        }

        if (contentId.startsWith('~/')) {
            const restPath = contentId.substring(2);

            for (const bookId of bookIds ?? []) {
                if (contextId.startsWith(bookId)) {
                    return bookId + '/' + restPath;
                }
            }

            // Not in any book, convert to absolute path
            return '/' + restPath;
        }

        return contextId + '/' + contentId;
    })();

    return resolveContentPath(unresolvedPath);
}

export function resolveContentPath(toResolvePath: string) {
    const reverseParts = toResolvePath.split('/').reverse();
    const resolvedParts: string[] = [];

    let skipCounter = 0;

    for (let i = 0; i < reverseParts.length; i++) {
        const part = reverseParts[i];

        if (part === '..') {
            skipCounter++;
            continue;
        }

        if (skipCounter) {
            skipCounter--;
            continue;
        }

        if (part && part !== '.') {
            resolvedParts.unshift(part);
        }
    }

    return resolvedParts.join('/');
}
