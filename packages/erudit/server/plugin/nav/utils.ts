import { ERUDIT_SERVER } from '@server/global';
import { isRootNode, type NavNode, type RootNavNode } from '@server/nav/node';

export async function walkNav(
    step: (node: NavNode) => Promise<void | false>,
    from: NavNode | typeof ERUDIT_SERVER.NAV = ERUDIT_SERVER.NAV,
) {
    if (!from) return;

    const stepResult = isRootNode(from) ? true : await step(from);

    if (stepResult !== false)
        if (from.children)
            for (const child of from.children) await walkNav(step, child);
}

//
//
//

export function getNavBookIds(mode: 'full' | 'short'): string[] {
    const bookIds: string[] = [];

    if (!ERUDIT_SERVER.NAV_BOOKS) {
        return bookIds;
    }

    for (const navBook of Object.values(ERUDIT_SERVER.NAV_BOOKS)) {
        bookIds.push(mode === 'full' ? navBook.fullId : navBook.shortId);
    }

    return bookIds;
}

export function getNavBookOf(target: string | NavNode): NavNode | undefined {
    const id = typeof target === 'string' ? target : target.fullId;

    if (!id || !ERUDIT_SERVER.NAV_BOOKS) {
        return undefined;
    }

    const idParts = id.split('/');

    while (idParts.length > 0) {
        const book = ERUDIT_SERVER.NAV_BOOKS[idParts.join('/')];

        if (book) {
            return book;
        }

        idParts.pop();
    }

    return undefined;
}

export async function getPreviousNextNav(contentId: string) {
    let previousNav: NavNode | undefined, nextNav: NavNode | undefined;
    let book: NavNode | undefined;
    let finish = false;

    await walkNav(async (navNode) => {
        if (navNode.fullId === contentId) {
            book = getNavBookOf(navNode);
            finish = true;
            return;
        }

        if (finish && !nextNav) {
            nextNav = navNode;
            return false;
        }

        if (!finish) previousNav = navNode;
    });

    if (book) {
        //
        // Can't lead out of current book (if givent content item is inside the book)
        //

        if (previousNav)
            if (getNavBookOf(previousNav)?.fullId !== book.fullId)
                previousNav = undefined;

        if (nextNav)
            if (getNavBookOf(nextNav)?.fullId !== book.fullId)
                nextNav = undefined;
    } else {
        //
        // If not inside the book and tries to lead inside a book, then force lead to book's about page
        //

        if (previousNav) previousNav = getNavBookOf(previousNav) || previousNav;

        if (nextNav) nextNav = getNavBookOf(nextNav) || nextNav;
    }

    return {
        previousNav,
        nextNav,
    };
}

/**
 * Find navigation node by mixed content ID.
 * It can be full ID, short ID or any combination of present and missing skipped parts.
 */
export function getNavNode(mixedContentId: string): NavNode {
    const parts = mixedContentId.split('/');
    let foundNode: NavNode | undefined;

    function search(node: NavNode, partIdx: number): NavNode | undefined {
        const targetIdPart = parts[partIdx];
        const nodeIdPart = node.idPart;

        if (nodeIdPart === targetIdPart) {
            if (partIdx === parts.length - 1) {
                return node;
            }

            for (const child of node.children || []) {
                const deepResult = search(child, partIdx + 1);
                if (deepResult) return deepResult;
            }
        }

        if (node.skip) {
            for (const child of node.children || []) {
                const deepResult = search(child, partIdx);
                if (deepResult) return deepResult;
            }
        }

        return undefined;
    }

    for (const child of ERUDIT_SERVER.NAV?.children || []) {
        foundNode = search(child, 0);
        if (foundNode) break;
    }

    if (!foundNode) {
        throw new Error(
            `Failed to find navigation content node for ID: ${mixedContentId}`,
        );
    }

    return foundNode;
}

export function getIdsUp(contentId: string): string[] {
    const ids: string[] = [];
    const startNavNode = getNavNode(contentId);

    if (!startNavNode) return ids;

    let currentNavNode: NavNode = startNavNode;

    while (currentNavNode?.idPart) {
        ids.push(currentNavNode.fullId);
        currentNavNode = currentNavNode.parent as NavNode;
    }

    return ids;
}

export async function isSkipId(contentId: string) {
    let hidden = false;

    await walkNav(async (navNode) => {
        if (navNode.fullId === contentId) {
            hidden = navNode.skip;
            return false;
        }
    });

    return hidden;
}
