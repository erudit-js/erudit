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
    const existingBookTitles = new Set<string>();

    for (const dbContribution of dbContributions) {
        const contentId = dbContribution.contentId;
        const contentNavNode = getNavNode(contentId);

        const bookData = await (async () => {
            const bookNavNode = getNavBookOf(contentId);

            if (!bookNavNode) {
                return undefined;
            }

            const bookId = bookNavNode.fullId;

            if (!bookId) {
                return undefined;
            }

            if (bookId === contentId) {
                return undefined;
            }

            let bookTitle = await getBookTitleFor(bookId);

            let cursor = bookNavNode;
            while (cursor) {
                if (cursor.type === 'group') {
                    const groupTitle = await getContentTitle(cursor.fullId);
                    const newBookTitle = groupTitle + ' / ' + bookTitle;

                    if (bookTitle && existingBookTitles.has(bookTitle)) {
                        bookTitle = newBookTitle;
                    }
                }

                cursor = cursor.parent as any;
            }

            if (bookTitle) {
                existingBookTitles.add(bookTitle);
            }

            return {
                bookId,
                bookTitle,
            };
        })();

        const contentTitle = await getContentTitle(contentId);
        const contentLink = await getContentLink(contentId);

        const contribution: Contribution = {
            bookId: bookData?.bookId,
            bookTitle: bookData?.bookTitle,
            contentType: contentNavNode.type,
            contentTitle,
            contentLink,
        };

        contributions.push(contribution);
    }

    return contributions;
}
