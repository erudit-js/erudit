import { eq } from 'drizzle-orm';

export async function getContentTitle(
    fullContentId: string,
    type: 'normal' | 'nav' = 'normal',
) {
    const dbContentItem = await ERUDIT.db.query.content.findFirst({
        columns: {
            title: true,
            navTitle: true,
        },
        where: eq(ERUDIT.db.schema.content.fullId, fullContentId),
    });

    if (!dbContentItem) {
        throw createError({
            statusCode: 404,
            message: `Content with id "${fullContentId}" not found!`,
        });
    }

    if (type === 'nav' && dbContentItem.navTitle) {
        return dbContentItem.navTitle;
    }

    return dbContentItem.title || fullContentId.split('/').pop()!;
}
