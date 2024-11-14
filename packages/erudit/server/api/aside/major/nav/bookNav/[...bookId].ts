import { ERUDIT_SERVER } from '@server/global';
import { createBookFrontNav } from '@server/repository/frontNav';

export default defineEventHandler(async (event) => {
    const bookId = getRouterParam(event, 'bookId');

    if (
        !bookId ||
        !ERUDIT_SERVER.NAV_BOOKS ||
        !(bookId in ERUDIT_SERVER.NAV_BOOKS)
    )
        throw createError({
            statusCode: 400,
            statusText: `Unknown book id "${bookId}"!`,
        });

    const bookNode = ERUDIT_SERVER.NAV_BOOKS[bookId]!;

    return await createBookFrontNav(bookNode);
});
