import type { ContentNavNode } from '../types';

export function getPreviousNext(node: ContentNavNode) {
    const currentFullId = node.fullId;

    let previous: ContentNavNode | undefined;
    let next: ContentNavNode | undefined;
    let currentFound = false;

    for (const navNode of ERUDIT.contentNav.id2Node.values()) {
        if (currentFound) {
            next = navNode;
            break;
        }

        if (navNode.fullId === currentFullId) {
            currentFound = true;
        } else {
            previous = navNode;
        }
    }

    // If current inside book then next can't point outside of book
    if (next) {
        const currentBook = ERUDIT.contentNav.getBookFor(node);
        if (currentBook) {
            const nextBook = ERUDIT.contentNav.getBookFor(next);
            if (!nextBook || nextBook.fullId !== currentBook.fullId) {
                next = undefined;
            }
        }
    }

    return { previous, next };
}
