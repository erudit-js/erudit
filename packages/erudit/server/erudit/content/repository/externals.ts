import { eq, like } from 'drizzle-orm';
import type { ContentExternals } from '@erudit-js/core/content/externals';

export async function getContentExternals(
    fullId: string,
): Promise<ContentExternals> {
    const externals: ContentExternals = [];

    const dbOwnContentItem = await ERUDIT.db.query.content.findFirst({
        columns: { externals: true },
        where: eq(ERUDIT.db.schema.content.fullId, fullId),
    });

    if (dbOwnContentItem?.externals) {
        externals.push({
            type: 'own',
            items: dbOwnContentItem.externals,
        });
    }
    const parts = fullId.split('/');
    const dbParentContentItems = [];

    for (let i = parts.length - 1; i > 0; i--) {
        const parentId = parts.slice(0, i).join('/');
        const dbParentContentItem = await ERUDIT.db.query.content.findFirst({
            columns: {
                fullId: true,
                externals: true,
                title: true,
            },
            where: eq(ERUDIT.db.schema.content.fullId, parentId),
        });

        if (dbParentContentItem) {
            dbParentContentItems.push(dbParentContentItem);
        }
    }

    for (const dbParentContentItem of dbParentContentItems) {
        if (dbParentContentItem?.externals) {
            externals.push({
                type: 'parent',
                title: dbParentContentItem.title,
                items: dbParentContentItem.externals,
            });
        }
    }

    return externals;
}
