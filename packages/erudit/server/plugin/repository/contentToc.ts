import type { ContentToc } from '@shared/content/toc';

import { DbContent } from '@server/db/entities/Content';
import { ERUDIT_SERVER } from '@server/global';
import { getNavNode } from '@server/nav/utils';
import { createContentLink } from '@server/repository/link';
import { getElementStats } from '@erudit/server/plugin/repository/elementStats';
import { getQuickLinks } from '@server/repository/quickLink';
import { countTopicsIn } from '@server/repository/topicCount';

async function processChildContent(childId: string): Promise<any> {
    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['title', 'description', 'type'],
        where: {
            contentId: childId,
        },
    });

    if (!dbContent) {
        throw createError({
            statusCode: 404,
            statusMessage: `Failed to create content TOC!\nContent with ID "${childId}" not found!`,
        });
    }

    const title = dbContent.title ?? childId;
    const link = await createContentLink(childId);
    const description = dbContent.description;

    switch (dbContent.type) {
        case 'book':
        case 'group':
            const stats = await getElementStats(childId);
            const topicCount = await countTopicsIn(childId);
            return {
                type: dbContent.type,
                link,
                title,
                description,
                topicCount,
                stats: stats || [],
            };
        case 'topic':
            const quickLinks = await getQuickLinks(childId);
            return {
                type: 'topic',
                link,
                title,
                description,
                quickLinks,
            };
    }
}

export async function getContentToc(
    mixedContentId: string,
): Promise<ContentToc> {
    const navNode = getNavNode(mixedContentId);
    const childIds = navNode.children?.map((child) => child.fullId) || [];
    const toc: ContentToc = [];

    for (const childId of childIds) {
        const tocItem = await processChildContent(childId);
        if (tocItem) {
            toc.push(tocItem);
        }
    }

    return toc;
}

export async function getFullContentToc(): Promise<ContentToc | undefined> {
    const rootNode = ERUDIT_SERVER.NAV;

    if (!rootNode) {
        return undefined;
    }

    const childIds = rootNode.children?.map((child) => child.fullId) || [];
    const toc: ContentToc = [];

    for (const childId of childIds) {
        const tocItem = await processChildContent(childId);
        if (tocItem) {
            toc.push(tocItem);
        }
    }

    return toc;
}
