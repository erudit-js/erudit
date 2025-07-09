import { Like } from 'typeorm';
import { createHash } from 'crypto';

import type {
    ContentSourceUsage,
    ContentSourceUsageSet,
    ContentSourceUsageSetItem,
} from '@shared/content/reference';
import { ERUDIT_SERVER } from '@server/global';
import { DbContent } from '@server/db/entities/Content';
import { createContentLink } from '@server/repository/link';
import { getFullContentId } from '@server/repository/contentId';

export async function getContentSourceUsageSet(
    mixedContentId: string,
): Promise<ContentSourceUsageSet> {
    const contentFullId = getFullContentId(mixedContentId);
    const dbContentItems = await ERUDIT_SERVER.DB.manager.find(DbContent, {
        select: ['contentId'],
        where: { contentId: Like(`${contentFullId}/%`), type: 'topic' },
    });

    const usageSetObj: Record<string, ContentSourceUsageSetItem> = {};

    for (const childId of dbContentItems.map((item) => item.contentId)) {
        const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
            select: ['title', 'type', 'references'],
            where: { contentId: childId },
        });

        if (!dbContent || !dbContent.references) {
            continue;
        }

        const referenceGroups = dbContent.references;
        for (const referenceGroup of referenceGroups) {
            const source = referenceGroup.source;
            const sourceId = getObjectUuid(source);

            if (!(sourceId in usageSetObj)) {
                usageSetObj[sourceId] = {
                    source,
                    usages: [],
                };
            }

            const usageSet = usageSetObj[sourceId];

            usageSet.usages.push({
                type: dbContent.type,
                title: dbContent.title || childId,
                count: referenceGroup.references.length,
                link: await createContentLink(childId),
            });
        }
    }

    const sortedEntries = Object.entries(usageSetObj).sort(([, a], [, b]) => {
        const aFeatured = !!a.source.featured;
        const bFeatured = !!b.source.featured;

        if (aFeatured !== bFeatured) {
            return bFeatured ? 1 : -1;
        }

        const aSum = a.usages.reduce((sum, usage) => sum + usage.count, 0);
        const bSum = b.usages.reduce((sum, usage) => sum + usage.count, 0);

        return bSum - aSum;
    });

    return sortedEntries.map(([, value]) => value);
}

export function getObjectUuid(obj: any): string {
    const serialized = JSON.stringify(obj, Object.keys(obj).sort());
    return createHash('sha256').update(serialized).digest('hex').slice(0, 8);
}
