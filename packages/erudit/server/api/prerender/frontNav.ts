export default defineEventHandler(async () => {
    const bookShortIds = Array.from(ERUDIT.contentNav.id2Books.values()).map(
        (bookNode) => bookNode.shortId,
    );

    const routes: string[] = [];

    for (const bookShortId of bookShortIds) {
        routes.push(`/api/aside/major/frontNav/book/${bookShortId}`);
    }

    return routes;
});
