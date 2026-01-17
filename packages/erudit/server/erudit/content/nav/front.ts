import { eq } from 'drizzle-orm';

import type { ContentNavNode } from './types';

export async function getGlobalFrontContentNav(): Promise<FrontGlobalContentNav> {
    const bookShortIds = Array.from(ERUDIT.contentNav.id2Books.values()).map(
        (b) => b.shortId,
    );

    const navItems = await Promise.all(
        Array.from(ERUDIT.contentNav.id2Root.values()).map(
            async (navNode) => await createFrontContentNavItem(navNode, true),
        ),
    );

    return {
        bookShortIds,
        frontNavItems: navItems.filter((item) => item !== undefined),
    };
}

export async function getBookFrontContentNav(
    bookNavNode: ContentNavNode,
): Promise<FrontContentNavBook> {
    if (bookNavNode.type !== 'book') {
        throw createError({
            status: 400,
            message: `Provided nav node "${bookNavNode.fullId}" is not a book!`,
        });
    }

    return (await createFrontContentNavItem(
        bookNavNode,
        false,
        true, // include empty book when directly requesting book nav
    )) as FrontContentNavBook;
}

async function createFrontContentNavItem(
    navNode: ContentNavNode,
    isGlobal: boolean,
    includeIfEmpty = false,
): Promise<FrontContentNavItem | undefined> {
    const dbContentItem = (await ERUDIT.db.query.content.findFirst({
        columns: {
            title: true,
            navTitle: true,
            flags: true,
            hidden: true,
        },
        where: eq(ERUDIT.db.schema.content.fullId, navNode.fullId),
    }))!;

    if (ERUDIT.config.public.mode === 'static' && dbContentItem.hidden) {
        if (navNode.type === 'book') {
            if (isGlobal) {
                // We can hide book in global nav.
                return undefined;
            } else {
                // But we should show the book if user is already inside it.
            }
        } else {
            return undefined;
        }
    }

    const baseItem: FrontContentNavItemBase = {
        shortId: navNode.shortId,
        title: dbContentItem.navTitle || dbContentItem.title,
        flags: dbContentItem.flags || {},
        link: await ERUDIT.repository.content.link(navNode.fullId),
    };

    async function processChildren() {
        const children = await Promise.all(
            (navNode.children || []).map(
                async (childNavNode) =>
                    await createFrontContentNavItem(childNavNode, isGlobal),
            ),
        );
        return children.filter(
            (c): c is FrontContentNavItem => c !== undefined,
        );
    }

    switch (navNode.type) {
        case 'topic':
            return {
                type: 'topic',
                ...baseItem,
            };
        case 'page':
            return {
                type: 'page',
                ...baseItem,
            };
        case 'group': {
            const dbGroup = (await ERUDIT.db.query.groups.findFirst({
                columns: { separator: true },
                where: eq(ERUDIT.db.schema.groups.fullId, navNode.fullId),
            }))!;
            const children = await processChildren();
            if (children.length === 0 && !includeIfEmpty) {
                return undefined;
            }
            return {
                type: 'group',
                separator: dbGroup.separator,
                ...baseItem,
                children,
            };
        }
        case 'book': {
            const children = await processChildren();
            // In global nav we suppress empty books; when directly loading book (includeIfEmpty)
            // we still return it so consumer can show the book shell.
            if (children.length === 0 && !includeIfEmpty) {
                return undefined;
            }
            return {
                type: 'book',
                ...baseItem,
                children: isGlobal ? [] : children,
            };
        }
    }
}
