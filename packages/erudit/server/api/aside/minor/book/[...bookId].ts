import {
    getAsideMinorContentBase,
    getAsideMinorContentNode,
} from '@server/repository/asideMinor';

import type { AsideMinorBook } from '@erudit/shared/aside/minor';

export default defineEventHandler(async (event) => {
    const bookNavNode = getAsideMinorContentNode(
        'book',
        event.context.params?.bookId,
    );

    return {
        type: 'book',
        ...(await getAsideMinorContentBase(bookNavNode)),
    } satisfies AsideMinorBook;
});
