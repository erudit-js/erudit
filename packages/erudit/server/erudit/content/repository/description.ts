import { eq } from 'drizzle-orm';

export async function getContentDescription(
    fullContentId: string,
): Promise<string | undefined> {
    const dbContentItem = (await ERUDIT.db.query.content.findFirst({
        where: eq(ERUDIT.db.schema.content.fullId, fullContentId),
    }))!;

    return dbContentItem.description || undefined;
}
