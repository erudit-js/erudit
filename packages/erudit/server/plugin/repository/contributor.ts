import { DbContributor } from '@server/db/entities/Contributor';
import { DbContribution } from '@server/db/entities/Contribution';
import { ERUDIT_SERVER } from '@server/global';
import { getNavBookOf, getNavNode } from '@server/nav/utils';
import { getBookTitleFor } from '@server/repository/book';
import { getContentLink, getContentTitle } from '@server/repository/content';

import type { Contribution, PageContributor } from '@shared/contributor';

export async function contributorExists(contributorId: string) {
    return await ERUDIT_SERVER.DB.manager.exists(DbContributor, {
        where: { contributorId },
    });
}

export async function getContributorPageData(
    contributorId: string,
): Promise<PageContributor> {
    if (!(await contributorExists(contributorId))) {
        throw createError({
            statusCode: 404,
            message: `Contributor ${contributorId} not found!`,
        });
    }

    const dbContributor = (await ERUDIT_SERVER.DB.manager.findOne(
        DbContributor,
        {
            select: [
                'displayName',
                'slogan',
                'links',
                'avatar',
                'isEditor',
                'description',
            ],
            where: { contributorId },
        },
    ))!;

    return {
        contributorId,
        displayName: dbContributor.displayName,
        slogan: dbContributor.slogan,
        links: dbContributor.links,
        avatar: dbContributor.avatar,
        isEditor: dbContributor.isEditor,
        hasDescription: !!dbContributor.description,
        contributions: await getContributions(contributorId),
    };
}

export async function getContributions(
    contributorId: string,
): Promise<Contribution[]> {
    const dbContributions = await ERUDIT_SERVER.DB.manager.find(
        DbContribution,
        {
            select: ['contentId'],
            where: { contributorId },
        },
    );

    const contributions: Contribution[] = [];

    for (const dbContribution of dbContributions) {
        const contentId = dbContribution.contentId;
        const contentNavNode = getNavNode(contentId);

        const bookTitle = await (async () => {
            const bookId = getNavBookOf(contentId)?.fullId;

            if (!bookId) {
                return undefined;
            }

            if (bookId === contentId) {
                return undefined;
            }

            return await getBookTitleFor(bookId);
        })();

        const contentTitle = await getContentTitle(contentId);
        const contentLink = await getContentLink(contentId);

        const contribution: Contribution = {
            bookTitle: bookTitle,
            contentType: contentNavNode.type,
            contentTitle,
            contentLink,
        };

        contributions.push(contribution);
    }

    return contributions;
}
