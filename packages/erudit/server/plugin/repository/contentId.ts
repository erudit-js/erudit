import { DbContentId } from '@server/db/entities/ContentId';
import { ERUDIT_SERVER } from '@server/global';

async function findContentId(contentId: string): Promise<DbContentId> {
    const dbContentId = await ERUDIT_SERVER.DB.manager.findOne(DbContentId, {
        where: [{ shortId: contentId }, { fullId: contentId }],
    });

    if (!dbContentId) {
        throw new Error(
            `Can't find both short or full content id: ${contentId}!`,
        );
    }

    return dbContentId;
}

export async function getFullContentId(maybeShortId: string): Promise<string> {
    const dbContentId = await findContentId(maybeShortId);
    return dbContentId.fullId;
}

export async function getShortContentId(maybeFullId: string): Promise<string> {
    const dbContentId = await findContentId(maybeFullId);
    return dbContentId.shortId;
}
