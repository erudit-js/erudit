import { DbContribution } from '@server/db/entities/Contribution';
import { DbContributor } from '@server/db/entities/Contributor';
import { ERUDIT_SERVER } from '@server/global';

import { type ContributorListItem } from '@shared/contributor';

export default defineEventHandler<Promise<ContributorListItem[]>>(async () => {
    const dbContributors = await ERUDIT_SERVER.DB.manager.find(DbContributor, {
        select: ['contributorId', 'displayName', 'isEditor', 'avatar'],
    });

    if (dbContributors.length === 0) {
        return [];
    }

    const contributors: ContributorListItem[] = await Promise.all(
        dbContributors.map(async (dbContributor) => {
            const contributions = await ERUDIT_SERVER.DB.manager.count(
                DbContribution,
                {
                    where: { contributorId: dbContributor.contributorId },
                },
            );

            return {
                contributorId: dbContributor.contributorId,
                displayName: dbContributor.displayName,
                isEditor: dbContributor.isEditor,
                avatar: dbContributor.avatar,
                contributions,
            };
        }),
    );

    contributors.sort((a, b) => {
        if (a.isEditor !== b.isEditor) {
            return a.isEditor ? -1 : 1;
        }

        return b.contributions - a.contributions;
    });

    return contributors;
});
