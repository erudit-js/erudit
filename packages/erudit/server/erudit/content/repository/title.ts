import { eq } from 'drizzle-orm';

export async function getContentTitle(fullContentId: string) {
    const dbContentItem = await ERUDIT.db.query.content.findFirst({
        columns: {
            title: true,
        },
        where: eq(ERUDIT.db.schema.content.fullId, fullContentId),
    });

    if (!dbContentItem) {
        throw createError({
            statusCode: 404,
            message: `Content with id "${fullContentId}" not found!`,
        });
    }

    return dbContentItem.title;
}
