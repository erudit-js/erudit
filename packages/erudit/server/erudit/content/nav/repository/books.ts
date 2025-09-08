import type { ContentNavNode } from '../types';

export function getBooks(): ContentNavNode[] {
    return Array.from(ERUDIT.contentNav.id2Books.values());
}

export function getBookIds(idType: 'full' | 'short' = 'full'): string[] {
    return getBooks().map((book) =>
        idType === 'short' ? book.shortId : book.fullId,
    );
}

export function getBookFor(
    nodeOrId: ContentNavNode | string,
): ContentNavNode | undefined {
    const node =
        typeof nodeOrId === 'string'
            ? ERUDIT.contentNav.getNode(nodeOrId)
            : nodeOrId;

    if (!node) {
        return;
    }

    const nodeFullId = node.fullId;
    let longestMatch: ContentNavNode | undefined;

    for (const book of ERUDIT.contentNav.id2Books.values()) {
        if (nodeFullId.startsWith(book.fullId)) {
            if (
                !longestMatch ||
                book.fullId.length > longestMatch.fullId.length
            ) {
                longestMatch = book;
            }
        }
    }

    return longestMatch;
}
