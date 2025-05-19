import { ERUDIT_SERVER } from '@server/global';
import { getNavBookOf } from '@server/nav/utils';
import { DbContent } from '@server/db/entities/Content';
import { getFullContentId } from './contentId';

export async function getContentBookFor(contentId: string) {
    contentId = getFullContentId(contentId);
    const navBook = getNavBookOf(contentId);

    if (!navBook) return undefined;

    const bookId = navBook.fullId;

    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['title'],
        where: { contentId: bookId },
    });

    return {
        contentId: bookId,
        title: dbContent?.title || bookId,
    };
}

export async function getBookTitleFor(contentId: string) {
    contentId = getFullContentId(contentId);
    const navBook = getNavBookOf(contentId);

    if (!navBook) return undefined;

    const bookId = navBook.fullId;

    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['title'],
        where: { contentId: bookId },
    });

    return dbContent?.title || bookId;
}
