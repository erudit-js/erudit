import type { ListContributor } from '@erudit-js/core/contributor';

export default defineEventHandler<Promise<ListContributor[]>>(async (event) => {
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

    return listContributors;
});
