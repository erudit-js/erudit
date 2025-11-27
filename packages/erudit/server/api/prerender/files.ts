export default defineEventHandler(async () => {
    const dbFiles = await ERUDIT.db.query.files.findMany();
    const routes: string[] = [];

    for (const dbFile of dbFiles) {
        const projectRelativePath = dbFile.path.replace(
            ERUDIT.config.paths.project + '/',
            '',
        );
        routes.push(`/file/${projectRelativePath}`);
    }

    return routes;
});
