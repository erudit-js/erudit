import { count } from 'drizzle-orm';

export async function countContributors(): Promise<number> {
    const dbResult = await ERUDIT.db
        .select({ count: count() })
        .from(ERUDIT.db.schema.contributors);

    return dbResult?.[0]?.count || 0;
}
