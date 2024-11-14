import { ERUDIT_SERVER } from '@server/global';
import { getNavBookOf } from '@server/nav/utils';
import { DbContent } from '@server/db/entities/Content';

export async function getContentBookFor(contentId: string) {
    const navBook = getNavBookOf(contentId);

    if (!navBook) return undefined;

    const bookId = navBook.id;

    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['title'],
        where: { contentId: bookId },
    });

    return {
        contentId: bookId,
        title: dbContent?.title || bookId,
    };
}
