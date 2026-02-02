import { and, eq, sql } from 'drizzle-orm';

export async function addContentElementCount(
  fullId: string,
  schemaName: string,
  amount: number,
): Promise<void> {
  await ERUDIT.db
    .insert(ERUDIT.db.schema.contentElementStats)
    .values({
      fullId,
      schemaName,
      count: 0,
    })
    .onConflictDoNothing();

  await ERUDIT.db
    .update(ERUDIT.db.schema.contentElementStats)
    .set({
      count: sql`${ERUDIT.db.schema.contentElementStats.count} + ${amount}`,
    })
    .where(
      and(
        eq(ERUDIT.db.schema.contentElementStats.fullId, fullId),
        eq(ERUDIT.db.schema.contentElementStats.schemaName, schemaName),
      ),
    );
}

export async function getContentStats(
  fullContentId?: string,
): Promise<ContentStats | undefined> {
  const stats: ContentStats = {};

  const rootNavNode = fullContentId
    ? ERUDIT.contentNav.getNodeOrThrow(fullContentId)
    : ({
        type: '_root',
        children: Array.from(ERUDIT.contentNav.id2Root.values()),
      } as const);

  if (rootNavNode.type !== 'topic' && rootNavNode.type !== 'page') {
    // Container node, so look for materials inside it
    let materialCount = 0;
    await ERUDIT.contentNav.walk((navNode) => {
      if (navNode.type === 'topic' || navNode.type === 'page') {
        materialCount++;
      }
    }, rootNavNode as any);

    if (materialCount > 0) {
      stats.materials = materialCount;
    }
  }

  const schema2Count: Record<string, number> = {};

  const rows = await ERUDIT.db.query.contentElementStats.findMany({
    where: fullContentId
      ? sql`${ERUDIT.db.schema.contentElementStats.fullId} = ${fullContentId} OR ${ERUDIT.db.schema.contentElementStats.fullId} LIKE ${fullContentId + '/%'}`
      : sql`1=1`,
  });

  for (const row of rows) {
    if (row.count > 0) {
      schema2Count[row.schemaName] =
        (schema2Count[row.schemaName] || 0) + row.count;
    }
  }

  // Possible merge arrays of schema names into single stats entry
  const actualElementStats = ERUDIT.config.countElements.reduce<
    Record<string, number>
  >((acc, current) => {
    if (Array.isArray(current)) {
      const firstKey = current[0]!;
      const sum = current.reduce((sum, name) => {
        return sum + (schema2Count[name] || 0);
      }, 0);
      if (sum > 0) {
        acc[firstKey] = sum;
      }
    } else {
      const count = schema2Count[current] || 0;
      if (count > 0) {
        acc[current] = count;
      }
    }
    return acc;
  }, {});

  if (Object.keys(actualElementStats).length > 0) {
    stats.elements = actualElementStats;
  }

  return Object.keys(stats).length > 0 ? stats : undefined;
}
