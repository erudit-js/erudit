import { Like } from 'typeorm';

import type { ElementStats } from '@shared/stat';

import { DbStat } from '@server/db/entities/Stat';
import { ERUDIT_SERVER } from '@server/global';
import { getFullContentId } from '@server/repository/contentId';

function buildGroupMappings() {
    const statNames = ERUDIT_SERVER.CONFIG.bitran?.stat || [];
    const orderedGroups: string[] = [];
    const elementToGroup = new Map<string, string>();

    statNames.forEach((item) => {
        if (typeof item === 'string') {
            orderedGroups.push(item);
            elementToGroup.set(item, item);
        } else if (Array.isArray(item) && item.length > 0) {
            const groupName = item[0];
            orderedGroups.push(groupName);
            item.forEach((elementName) => {
                elementToGroup.set(elementName, groupName);
            });
        }
    });

    return { orderedGroups, elementToGroup };
}

function processStats(
    dbStats: DbStat[],
    orderedGroups: string[],
    elementToGroup: Map<string, string>,
): ElementStats {
    const groupCounts = dbStats.reduce((counts, stat) => {
        const groupName =
            elementToGroup.get(stat.elementName) || stat.elementName;
        counts.set(groupName, (counts.get(groupName) || 0) + stat.count);
        return counts;
    }, new Map<string, number>());

    return orderedGroups
        .map((groupName) => ({
            elementName: groupName,
            count: groupCounts.get(groupName) || 0,
            type: 'element' as const,
        }))
        .filter((stat) => stat.count > 0);
}

export async function getElementStats(
    mixedContentId: string,
): Promise<ElementStats | undefined> {
    const contentId = getFullContentId(mixedContentId);
    const { orderedGroups, elementToGroup } = buildGroupMappings();

    const dbStats = await ERUDIT_SERVER.DB.manager.find(DbStat, {
        where: {
            contentId: Like(`${contentId}/%`),
        },
    });

    if (!dbStats.length) {
        return undefined;
    }

    return processStats(dbStats, orderedGroups, elementToGroup);
}

export async function getAllElementStats(): Promise<ElementStats> {
    const { orderedGroups, elementToGroup } = buildGroupMappings();

    const dbStats = await ERUDIT_SERVER.DB.manager.find(DbStat);

    if (!dbStats.length) {
        return [];
    }

    return processStats(dbStats, orderedGroups, elementToGroup);
}
