export default defineEventHandler(async () => {
    const dbContributors = await ERUDIT.db.query.contributors.findMany({
        columns: {
            contributorId: true,
            avatarExtension: true,
        },
        where: (contributors, { isNotNull }) =>
            isNotNull(contributors.avatarExtension),
    });

    const routes: string[] = [];

    for (const dbContributor of dbContributors) {
        routes.push(
            `/contributor/avatar/${dbContributor.contributorId}.${dbContributor.avatarExtension}`,
        );
    }

    return routes;
});
