export default defineEventHandler(async () => {
    const routes: string[] = [];

    const dbUniques = await ERUDIT.db.query.uniques.findMany({
        columns: {
            contentFullId: true,
            typeOrPart: true,
            uniqueSlug: true,
        },
    });

    for (const dbUnique of dbUniques) {
        const navNode = ERUDIT.contentNav.getNodeOrThrow(
            dbUnique.contentFullId,
        );
        routes.push(
            `/api/preview/contentUnique/${createContentPath(
                dbUnique.typeOrPart,
                navNode.fullId,
            )}/${dbUnique.uniqueSlug}.json`,
        );
    }

    return routes;
});
