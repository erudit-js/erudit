import { eq, count } from 'drizzle-orm';
import type { ContributorContribution } from '@erudit-js/core/content/contributions';

export async function countContributions(
    contributorId: string,
): Promise<number> {
    const result = await ERUDIT.db
        .select({ count: count() })
        .from(ERUDIT.db.schema.contentContributions)
        .where(
            eq(
                ERUDIT.db.schema.contentContributions.contributorId,
                contributorId,
            ),
        );

    return result[0].count;
}

export async function getContributorContributions(
    contributorId: string,
): Promise<ContributorContribution[] | undefined> {
    const contributions: ContributorContribution[] = [];

    const dbContributions = await ERUDIT.db.query.contentContributions.findMany(
        {
            columns: { contentFullId: true },
            where: eq(
                ERUDIT.db.schema.contentContributions.contributorId,
                contributorId,
            ),
        },
    );

    const contentFullIds = ERUDIT.contentNav.orderIds(
        dbContributions.map((c) => c.contentFullId),
    );

    const seenBookTitles = new Set<string>();
    let currentBookId: string | undefined;

    for (const contentFullId of contentFullIds) {
        const currentNode = ERUDIT.contentNav.getNodeOrThrow(contentFullId);
        const title = await ERUDIT.repository.content.title(
            contentFullId,
            'normal',
        );
        const link = await ERUDIT.repository.content.link(contentFullId);
        const book = ERUDIT.contentNav.getBookFor(contentFullId);

        const contributionItem = {
            type: currentNode.type as 'topic' | 'page',
            title,
            link,
        };

        if (book && book.fullId === currentBookId) {
            // Add to existing book group
            const lastContribution = contributions.at(-1);
            if (lastContribution && lastContribution.type === 'book') {
                lastContribution.items.push(contributionItem);
            }
        } else if (book) {
            // Start a new book group

            currentBookId = book.fullId;
            const bookNode = ERUDIT.contentNav.getNodeOrThrow(book.fullId);

            const baseBookTitle = await ERUDIT.repository.content.title(
                book.fullId,
                'normal',
            );

            let bookTitle = baseBookTitle;

            // Only include parent title if we've already seen a book with this title
            if (seenBookTitles.has(baseBookTitle) && bookNode.parent) {
                const parentTitle = await ERUDIT.repository.content.title(
                    bookNode.parent.fullId,
                    'normal',
                );
                bookTitle = `${parentTitle} / ${baseBookTitle}`;
            }

            // Track this title for future duplicates
            seenBookTitles.add(baseBookTitle);

            contributions.push({
                type: 'book',
                title: bookTitle,
                items: [contributionItem],
            });
        } else {
            // Standalone contribution (not part of a book)
            currentBookId = undefined;
            contributions.push(contributionItem);
        }
    }

    return contributions.length > 0 ? contributions : undefined;
}
