import { getBookFrontContentNav } from '#layers/erudit/server/erudit/content/nav/front';

export default defineEventHandler<Promise<FrontContentNavBook>>(
    async (event) => {
        const shortId = event.context.params!.shortId;
        const bookNavNode = ERUDIT.contentNav.getNodeOrThrow(shortId);

        return await getBookFrontContentNav(bookNavNode);
    },
);
