import { eq, count } from 'drizzle-orm';

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
