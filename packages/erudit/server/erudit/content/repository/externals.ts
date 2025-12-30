import type { ContentExternal } from '@erudit-js/core/content/externals';

export async function getContentExternals(
    fullId: string,
): Promise<ContentExternal[]> {
    const externals: ContentExternal[] = [];

    const dbContents = await ERUDIT.db.query.content.findMany({
        columns: { externals: true },
        where: (content, { eq, like, or }) =>
            or(eq(content.fullId, fullId), like(content.fullId, `${fullId}/%`)),
    });

    for (const content of dbContents) {
        if (content?.externals) {
            externals.push(...content.externals);
        }
    }

    return externals;
}
