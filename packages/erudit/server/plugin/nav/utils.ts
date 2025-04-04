import { ERUDIT_SERVER } from '@server/global';
import { isRootNode, type NavNode } from '@server/nav/node';

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

export function getNavBookIds() {
    return Object.keys(ERUDIT_SERVER.NAV_BOOKS || {});
}

export function getNavBookOf(target: string | NavNode): NavNode | undefined {
    const id = typeof target === 'string' ? target : target.id;

    if (!id || !ERUDIT_SERVER.NAV_BOOKS) return undefined;

    const idParts = id.split('/');

    while (idParts.length > 0) {
        const book = ERUDIT_SERVER.NAV_BOOKS[idParts.join('/')];

        if (book) return book;

        idParts.pop();
    }

    return undefined;
}

export async function getPreviousNextNav(contentId: string) {
    let previousNav: NavNode | undefined, nextNav: NavNode | undefined;
    let book: NavNode | undefined;
    let finish = false;

    await walkNav(async (navNode) => {
        if (navNode.id === contentId) {
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

export async function getNavNode(
    contentId: string,
): Promise<NavNode | undefined> {
    let navNode: NavNode | undefined;

    await walkNav(async (_navNode) => {
        if (_navNode.id === contentId) {
            navNode = _navNode;
            return false;
        }
    });

    return navNode;
}

export async function getIdsUp(contentId: string): Promise<string[]> {
    const startNavNode = await getNavNode(contentId);

    if (!startNavNode) return [];

    const ids: string[] = [];

    let currentNavNode: any = startNavNode;
    while (currentNavNode?.id) {
        ids.push(currentNavNode.id);
        currentNavNode = currentNavNode.parent;
    }

    return ids;
}

export async function isSkipId(contentId: string) {
    let hidden = false;

    await walkNav(async (navNode) => {
        if (navNode.id === contentId) {
            hidden = navNode.skip;
            return false;
        }
    });

    return hidden;
}
