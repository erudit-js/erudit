import type { ListContributor } from '@erudit-js/core/contributor';

export default defineEventHandler<Promise<ListContributor[]>>(async () => {
    const listContributors: ListContributor[] = [];
    const dbContributors = await ERUDIT.db.query.contributors.findMany();

    for (const dbContributor of dbContributors) {
        const contributions =
            await ERUDIT.repository.contributors.countContributions(
                dbContributor.contributorId,
            );

        const listContributor: ListContributor = {
            id: dbContributor.contributorId,
        };

        if (dbContributor.displayName) {
            listContributor.displayName = dbContributor.displayName;
        }

        if (dbContributor.short) {
            listContributor.short = dbContributor.short;
        }

        if (dbContributor.avatarExtension) {
            listContributor.avatarUrl =
                ERUDIT.repository.contributors.avatarUrl(
                    dbContributor.contributorId,
                    dbContributor.avatarExtension,
                );
        }

        if (contributions > 0) {
            listContributor.contributions = contributions;
        }

        if (dbContributor.editor) {
            listContributor.editor = dbContributor.editor;
        }

        listContributors.push(listContributor);
    }

    listContributors.sort((a, b) => {
        // Sort by contributions first (desc)
        const aContributions = a.contributions ?? 0;
        const bContributions = b.contributions ?? 0;

        if (aContributions !== bContributions) {
            return bContributions - aContributions;
        }

        // Then sort alphabetically by displayName or id
        const aName = a.displayName ?? a.id;
        const bName = b.displayName ?? b.id;

        return aName.localeCompare(bName);
    });

    return listContributors;
});
