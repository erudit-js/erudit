import { and, eq, like, or } from 'drizzle-orm';

export async function getContentDependencies(fullId: string) {
  const hardDependencies: ContentHardDep[] = [];

  const dbHardDependencies = await ERUDIT.db.query.contentDeps.findMany({
    columns: { toFullId: true, hard: true, reason: true },
    where: and(
      or(
        eq(ERUDIT.db.schema.contentDeps.fromFullId, fullId),
        like(ERUDIT.db.schema.contentDeps.fromFullId, `${fullId}/%`),
      ),
      eq(ERUDIT.db.schema.contentDeps.hard, true),
    ),
  });

  const fullId2Reason = dbHardDependencies.reduce((map, dbDependency) => {
    if (dbDependency.reason) {
      map.set(dbDependency.toFullId, dbDependency.reason);
    }
    return map;
  }, new Map<string, string>());

  const hardToFullIds = ERUDIT.contentNav.orderIds(
    externalToFullIds(dbHardDependencies),
  );

  for (const toFullId of hardToFullIds) {
    const reason = fullId2Reason.get(toFullId)!;
    const hardDep = await createContentDep('hard', toFullId, undefined, reason);
    if (hardDep) {
      hardDependencies.push(hardDep);
    }
  }

  //
  //
  //

  const autoDependencies: ContentAutoDep[] = [];

  const dbAutoDependencies = await ERUDIT.db.query.contentDeps.findMany({
    columns: { toFullId: true, hard: true, uniqueNames: true },
    where: and(
      or(
        eq(ERUDIT.db.schema.contentDeps.fromFullId, fullId),
        like(ERUDIT.db.schema.contentDeps.fromFullId, `${fullId}/%`),
      ),
      eq(ERUDIT.db.schema.contentDeps.hard, false),
    ),
  });

  // Merge unique names across rows that share the same toFullId
  // (can happen when a topic and its children both dep on the same target).
  const autoUniqueMap = new Map<string, Set<string>>();
  for (const row of dbAutoDependencies) {
    if (!autoUniqueMap.has(row.toFullId)) {
      autoUniqueMap.set(row.toFullId, new Set());
    }
    if (row.uniqueNames) {
      for (const name of row.uniqueNames.split(',')) {
        autoUniqueMap.get(row.toFullId)!.add(name);
      }
    }
  }

  // Skip auto-dependency if a hard dependency from the same source exists
  const autoToFullIds = ERUDIT.contentNav
    .orderIds(externalToFullIds(dbAutoDependencies))
    .filter((toFullId) => !fullId2Reason.has(toFullId));

  for (const toFullId of autoToFullIds) {
    const uniquePairs = Array.from(autoUniqueMap.get(toFullId) ?? []).map(
      (uniqueName) => ({ contentFullId: toFullId, uniqueName }),
    );
    const autoDep = await createContentDep('auto', toFullId, uniquePairs);
    if (autoDep) {
      autoDependencies.push(autoDep);
    }
  }

  return {
    hardDependencies,
    autoDependencies,
  };

  //
  //
  //

  // Skip dependency if it originates from current content item or its child
  function externalToFullIds(dbDeps: { toFullId: string }[]) {
    return dbDeps.reduce((ids, dbDep) => {
      const toFullId = dbDep.toFullId;
      const isToSelf = toFullId === fullId;
      const isToChild = toFullId.startsWith(`${fullId}/`);

      if (isToSelf || isToChild) {
        return ids;
      }

      ids.push(toFullId);
      return ids;
    }, [] as string[]);
  }
}

export async function getContentDependents(
  fullId: string,
): Promise<ContentAutoDep[]> {
  const dbDependents = await ERUDIT.db.query.contentDeps.findMany({
    columns: { fromFullId: true, toFullId: true, uniqueNames: true },
    where: or(
      eq(ERUDIT.db.schema.contentDeps.toFullId, fullId),
      like(ERUDIT.db.schema.contentDeps.toFullId, `${fullId}/%`),
    ),
  });

  // Group rows by fromFullId, collecting {contentFullId, uniqueName} pairs
  // (toFullId can vary when a dependent references different child pages).
  const fromUniquePairsMap = new Map<
    string,
    { contentFullId: string; uniqueName: string }[]
  >();
  const externalFromFullIds: string[] = [];

  for (const row of dbDependents) {
    const fromFullId = row.fromFullId;
    const isFromSelf = fromFullId === fullId;
    const isFromChild = fromFullId.startsWith(`${fullId}/`);

    if (isFromSelf || isFromChild) continue;

    if (!fromUniquePairsMap.has(fromFullId)) {
      fromUniquePairsMap.set(fromFullId, []);
      externalFromFullIds.push(fromFullId);
    }

    if (row.uniqueNames) {
      for (const name of row.uniqueNames.split(',')) {
        fromUniquePairsMap
          .get(fromFullId)!
          .push({ contentFullId: row.toFullId, uniqueName: name });
      }
    }
  }

  // Order sources according to nav structure
  const fromFullIds = ERUDIT.contentNav.orderIds(externalFromFullIds);

  const dependents = await Promise.all(
    fromFullIds.map((fromFullId) => {
      const uniquePairs = fromUniquePairsMap.get(fromFullId) ?? [];
      return createContentDep('auto', fromFullId, uniquePairs);
    }),
  );

  return dependents.filter((dep): dep is ContentAutoDep => dep !== undefined);
}

async function createContentDep(
  type: 'auto',
  fullId: string,
  uniquePairs: { contentFullId: string; uniqueName: string }[],
): Promise<ContentAutoDep | undefined>;
async function createContentDep(
  type: 'hard',
  fullId: string,
  uniquePairs: undefined,
  reason: string,
): Promise<ContentHardDep | undefined>;
async function createContentDep(
  type: 'auto' | 'hard',
  fullId: string,
  uniquePairs?: { contentFullId: string; uniqueName: string }[],
  reason?: string,
): Promise<ContentDep | undefined> {
  const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

  const hidden = await ERUDIT.repository.content.hidden(fullId);
  if (hidden) {
    return undefined;
  }

  const contentType = navNode.type;
  const [title, link] = await Promise.all([
    ERUDIT.repository.content.title(fullId),
    ERUDIT.repository.content.link(fullId),
  ]);

  if (type === 'hard') {
    return {
      type: 'hard',
      reason: reason!,
      contentType,
      title,
      link,
    };
  }

  const uniques =
    uniquePairs && uniquePairs.length > 0
      ? await resolveUniqueEntries(uniquePairs)
      : undefined;

  return {
    type: 'auto',
    contentType,
    title,
    link,
    ...(uniques && uniques.length > 0 ? { uniques } : {}),
  };
}

async function resolveUniqueEntries(
  pairs: { contentFullId: string; uniqueName: string }[],
): Promise<ContentDepUnique[]> {
  // Deduplicate by "contentFullId/uniqueName" to avoid showing the same
  // element twice when multiple prose types reference it.
  const seen = new Set<string>();
  const unique: typeof pairs = [];
  for (const pair of pairs) {
    const key = `${pair.contentFullId}/${pair.uniqueName}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(pair);
    }
  }

  const results = await Promise.all(
    unique.map(async ({ contentFullId, uniqueName }) => {
      const dbUnique = await ERUDIT.db.query.contentUniques.findFirst({
        columns: { title: true, prose: true, contentProseType: true },
        where: and(
          eq(ERUDIT.db.schema.contentUniques.contentFullId, contentFullId),
          eq(ERUDIT.db.schema.contentUniques.uniqueName, uniqueName),
        ),
      });

      if (!dbUnique) return null;

      const navNode = ERUDIT.contentNav.getNodeOrThrow(contentFullId);
      const schemaName = dbUnique.prose.schema.name;

      if (!schemaName) return null;

      const link =
        navNode.type === 'topic'
          ? PAGES.topic(
              dbUnique.contentProseType as any,
              navNode.shortId,
              dbUnique.prose.id,
            )
          : PAGES.page(navNode.shortId, dbUnique.prose.id);

      return {
        name: uniqueName,
        title: dbUnique.title ?? undefined,
        link,
        schemaName,
      } satisfies ContentDepUnique;
    }),
  );

  return results.filter((r): r is ContentDepUnique => r !== null);
}
