import type {
    FrontNav,
    FrontNavBase,
    FrontNavBook,
    FrontNavFolder,
    FrontNavItem,
    FrontNavSeparator,
    FrontNavTopic,
} from '@erudit/shared/frontNav';

import type { NavNode, RootNavNode } from '@server/nav/node';
import { ERUDIT_SERVER } from '@server/global';
import { DbContent } from '@server/db/entities/Content';
import { DbGroup } from '@server/db/entities/Group';

import { getTopicPart } from './topic';

export async function createGlobalFrontNav(
    from: RootNavNode | NavNode | undefined,
): Promise<FrontNav | []> {
    if (!from || !from.children) return [];

    return await Promise.all(
        from.children.map((node) =>
            toFrontNavItem({ node, level: 0, includeBookNav: true }),
        ),
    );
}

export async function createBookFrontNav(from: NavNode): Promise<FrontNavBook> {
    return await toFrontNavBook({ node: from, level: 0, includeBookNav: true });
}

type ToFuncArg = {
    node: NavNode;
    level: number;
    includeBookNav?: boolean;
};

async function toFrontNavItem(arg: ToFuncArg): Promise<FrontNavItem> {
    switch (arg.node.type) {
        case 'book':
            return await toFrontNavBook(arg);
        case 'topic':
            return await toFrontNavTopic(arg);
        case 'group':
            const dbGroup = await ERUDIT_SERVER.DB.manager.findOne(DbGroup, {
                select: ['type'],
                where: { contentId: arg.node.fullId },
            });

            if (!dbGroup)
                throw new Error(
                    `Missing group content item "${arg.node.fullId}" when creating front nav!`,
                );

            if (dbGroup.type === 'folder') return await toFrontNavFolder(arg);
            else return await toFrontNavSeparator(arg);
    }
}

async function toFrontNavBook({
    node,
    level,
    includeBookNav,
}: ToFuncArg): Promise<FrontNavBook> {
    return {
        type: 'book',
        children: await toFrontNavChildren({
            node,
            level: 0,
            includeBookNav,
        }),
        ...(await toFrontNavBase({ node, level })),
    };
}

async function toFrontNavSeparator({
    node,
    level,
    includeBookNav,
}: ToFuncArg): Promise<FrontNavSeparator> {
    return {
        type: 'separator',
        children: await toFrontNavChildren({ node, level, includeBookNav }),
        ...(await toFrontNavBase({ node, level })),
    };
}

async function toFrontNavFolder({
    node,
    level,
    includeBookNav,
}: ToFuncArg): Promise<FrontNavFolder> {
    return {
        type: 'folder',
        children: await toFrontNavChildren({
            node,
            level: level + 1,
            includeBookNav,
        }),
        ...(await toFrontNavBase({ node, level })),
    };
}

async function toFrontNavTopic({
    node,
    level,
}: ToFuncArg): Promise<FrontNavTopic> {
    const topicPart = await getTopicPart(node.fullId);
    return {
        type: 'topic',
        part: topicPart,
        ...(await toFrontNavBase({ node, level })),
    };
}

async function toFrontNavBase({
    node,
    level,
}: ToFuncArg): Promise<Omit<FrontNavBase, 'type'>> {
    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['title', 'navTitle', 'flags'],
        where: { contentId: node.fullId },
    });

    return {
        id: node.id,
        fullId: node.fullId,
        level,
        flags: dbContent?.flags,
        label:
            dbContent?.navTitle ||
            dbContent?.title ||
            node.id.split('/').pop()!,
    };
}

async function toFrontNavChildren({ node, includeBookNav, level }: ToFuncArg) {
    if (node.type === 'book' && !includeBookNav) return undefined;
    if (!node.children) return undefined;

    return Promise.all(
        node.children!.map((child) =>
            toFrontNavItem({ node: child, level, includeBookNav }),
        ),
    );
}
