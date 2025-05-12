import { getNavNode } from '@server/nav/utils';
import { createBookFrontNav } from '@server/repository/frontNav';

export default defineEventHandler(async (event) => {
    const bookId = getRouterParam(event, 'bookId');

    if (!bookId) {
        throw createError({
            statusCode: 400,
            statusText: 'Missing book ID!',
        });
    }

    const bookNode = getNavNode(bookId);

    return await createBookFrontNav(bookNode);
});
