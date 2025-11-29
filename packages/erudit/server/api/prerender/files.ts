export default defineEventHandler(async () => {
    const dbFiles = await ERUDIT.db.query.files.findMany();
    const routes = new Set<string>();

    for (const dbFile of dbFiles) {
        routes.add(`/file/${dbFile.path}`);
    }

    return Array.from(routes);
});
