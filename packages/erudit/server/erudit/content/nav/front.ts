import { eq } from 'drizzle-orm';
import { ContentType } from '@erudit-js/cog/schema';

import { ContentNavNode } from './types';

export async function getGlobalFrontContentNav(): Promise<FrontGlobalContentNav> {
    const bookShortIds = Array.from(
        ERUDIT.contentNav.id2Books.values().map((b) => b.shortId),
    );

    const navItems = await Promise.all(
        ERUDIT.contentNav.id2Root
            .values()
            .map(
                async (navNode) =>
                    await createFrontContentNavItem(navNode, true),
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
    if (bookNavNode.type !== ContentType.Book) {
        throw createError({
            status: 400,
            message: `Provided nav node "${bookNavNode.fullId}" is not a book!`,
        });
    }

    return (await createFrontContentNavItem(
        bookNavNode,
        false,
    )) as FrontContentNavBook;
}

async function createFrontContentNavItem(
    navNode: ContentNavNode,
    isGlobal: boolean,
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

    if (dbContentItem.hidden) {
        if (navNode.type === ContentType.Book) {
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
        return (await Promise.all(
            (navNode.children || [])
                .map(
                    async (childNavNode) =>
                        await createFrontContentNavItem(childNavNode, isGlobal),
                )
                .filter(Boolean),
        )) as FrontContentNavItem[];
    }

    switch (navNode.type) {
        case ContentType.Topic:
            return {
                type: ContentType.Topic,
                ...baseItem,
            };
        case ContentType.Page:
            return {
                type: ContentType.Page,
                ...baseItem,
            };
        case ContentType.Group:
            const dbGroup = (await ERUDIT.db.query.groups.findFirst({
                columns: { separator: true },
                where: eq(ERUDIT.db.schema.groups.fullId, navNode.fullId),
            }))!;

            return {
                type: ContentType.Group,
                separator: dbGroup.separator,
                ...baseItem,
                children: await processChildren(),
            };
        case ContentType.Book:
            return {
                type: ContentType.Book,
                ...baseItem,
                children: isGlobal ? [] : await processChildren(),
            };
    }
}
