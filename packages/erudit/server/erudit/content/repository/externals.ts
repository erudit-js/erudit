import type { ContentExternal } from '@erudit-js/core/content/externals';
import { eq } from 'drizzle-orm';

export async function getContentExternals(
    fullId: string,
): Promise<ContentExternal[]> {
    const externals: ContentExternal[] = [];

    const dbContentItems = await ERUDIT.db.query.content.findMany({
        columns: { fullId: true, type: true, externals: true },
        where: eq(ERUDIT.db.schema.content.fullId, fullId),
    });

    for (const dbContentItem of dbContentItems) {
        if (dbContentItem?.externals) {
            externals.push(...dbContentItem.externals);
        }
    }

    return externals;
}
