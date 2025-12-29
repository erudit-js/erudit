import { and, eq, sql } from 'drizzle-orm';

export async function addContentElementCount(
    fullId: string,
    schemaName: string,
    amount: number,
): Promise<void> {
    await ERUDIT.db
        .insert(ERUDIT.db.schema.contentElementCount)
        .values({
            fullId,
            schemaName,
            count: 0,
        })
        .onConflictDoNothing();

    await ERUDIT.db
        .update(ERUDIT.db.schema.contentElementCount)
        .set({
            count: sql`${ERUDIT.db.schema.contentElementCount.count} + ${amount}`,
        })
        .where(
            and(
                eq(ERUDIT.db.schema.contentElementCount.fullId, fullId),
                eq(ERUDIT.db.schema.contentElementCount.schemaName, schemaName),
            ),
        );
}

export async function getContentElementCounts(
    fullId: string,
): Promise<Record<string, number> | undefined> {
    const rows = await ERUDIT.db.query.contentElementCount.findMany({
        where: sql`${ERUDIT.db.schema.contentElementCount.fullId} = ${fullId} OR ${ERUDIT.db.schema.contentElementCount.fullId} LIKE ${fullId + '/%'}`,
    });

    const elementsCount: Record<string, number> = {};

    for (const row of rows) {
        if (row.count > 0) {
            elementsCount[row.schemaName] =
                (elementsCount[row.schemaName] || 0) + row.count;
        }
    }

    return Object.keys(elementsCount).length > 0 ? elementsCount : undefined;
}
