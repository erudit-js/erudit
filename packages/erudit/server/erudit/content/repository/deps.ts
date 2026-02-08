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
    const hardDep = await createContentDep('hard', toFullId, reason);
    if (hardDep) {
      hardDependencies.push(hardDep);
    }
  }

  //
  //
  //

  const autoDependencies: ContentAutoDep[] = [];

  const dbAutoDependencies = await ERUDIT.db.query.contentDeps.findMany({
    columns: { toFullId: true, hard: true },
    where: and(
      or(
        eq(ERUDIT.db.schema.contentDeps.fromFullId, fullId),
        like(ERUDIT.db.schema.contentDeps.fromFullId, `${fullId}/%`),
      ),
      eq(ERUDIT.db.schema.contentDeps.hard, false),
    ),
  });

  // Skip auto-dependency if a hard dependency from the same source exists
  const autoToFullIds = ERUDIT.contentNav
    .orderIds(externalToFullIds(dbAutoDependencies))
    .filter((toFullId) => !fullId2Reason.has(toFullId));

  for (const toFullId of autoToFullIds) {
    const autoDep = await createContentDep('auto', toFullId);
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
    columns: { fromFullId: true, toFullId: true },
    where: or(
      eq(ERUDIT.db.schema.contentDeps.toFullId, fullId),
      like(ERUDIT.db.schema.contentDeps.toFullId, `${fullId}/%`),
    ),
  });

  // Skip dependent if it originates from current content item or its child
  const externalFromFullIds = dbDependents.reduce((ids, dbDependent) => {
    const fromFullId = dbDependent.fromFullId;
    const isFromSelf = fromFullId === fullId;
    const isFromChild = fromFullId.startsWith(`${fullId}/`);

    if (isFromSelf || isFromChild) {
      return ids;
    }

    ids.push(fromFullId);
    return ids;
  }, [] as string[]);

  // Order sources according to nav structure
  const fromFullIds = ERUDIT.contentNav.orderIds(externalFromFullIds);

  const dependents = await Promise.all(
    fromFullIds.map((fromFullId) => createContentDep('auto', fromFullId)),
  );

  return dependents.filter((dep): dep is ContentAutoDep => dep !== undefined);
}

async function createContentDep(
  type: 'auto',
  fullId: string,
): Promise<ContentAutoDep | undefined>;
async function createContentDep(
  type: 'hard',
  fullId: string,
  reason: string,
): Promise<ContentHardDep | undefined>;
async function createContentDep(
  type: 'auto' | 'hard',
  fullId: string,
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

  return {
    type: 'auto',
    contentType,
    title,
    link,
  };
}
