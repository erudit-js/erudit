import { detectContentBookId } from '../content/bookId';

export function toAbsoluteContentPath(
    contentPath: string,
    contextPath: string,
    bookIds?: string[],
) {
    const unresolvedPath = (() => {
        if (contentPath.startsWith('/')) {
            return contentPath;
        }

        if (contentPath.startsWith('~/')) {
            const restPath = contentPath.substring(2);
            const bookId = detectContentBookId(contextPath, bookIds ?? []);

            if (bookId) {
                return bookId + '/' + restPath;
            }

            // Not in any book, convert to absolute path
            return '/' + restPath;
        }

        return contextPath + '/' + contentPath;
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
