import { and, eq, like, or } from 'drizzle-orm';

export async function getContentDependencies(fullId: string) {
  const hardDependencies: ContentHardDep[] = [];

  const dbHardDependencies = await ERUDIT.db.query.contentDeps.findMany({
    columns: { fromFullId: true, hard: true, reason: true },
    where: and(
      or(
        eq(ERUDIT.db.schema.contentDeps.toFullId, fullId),
        like(ERUDIT.db.schema.contentDeps.toFullId, `${fullId}/%`),
      ),
      eq(ERUDIT.db.schema.contentDeps.hard, true),
    ),
  });

  const fullId2Reason = dbHardDependencies.reduce((map, dbDependency) => {
    if (dbDependency.reason) {
      map.set(dbDependency.fromFullId, dbDependency.reason);
    }
    return map;
  }, new Map<string, string>());

  const hardFromFullIds = ERUDIT.contentNav.orderIds(
    externalFromFullIds(dbHardDependencies),
  );

  for (const fromFullId of hardFromFullIds) {
    const reason = fullId2Reason.get(fromFullId)!;
    const hardDep = await createContentDep('hard', fromFullId, reason);
    hardDependencies.push(hardDep);
  }

  //
  //
  //

  const autoDependencies: ContentAutoDep[] = [];

  const dbAutoDependencies = await ERUDIT.db.query.contentDeps.findMany({
    columns: { fromFullId: true, hard: true },
    where: and(
      or(
        eq(ERUDIT.db.schema.contentDeps.toFullId, fullId),
        like(ERUDIT.db.schema.contentDeps.toFullId, `${fullId}/%`),
      ),
      eq(ERUDIT.db.schema.contentDeps.hard, false),
    ),
  });

  // Skip auto-dependency if a hard dependency from the same source exists
  const autoFromFullIds = ERUDIT.contentNav
    .orderIds(externalFromFullIds(dbAutoDependencies))
    .filter((fromFullId) => !fullId2Reason.has(fromFullId));

  for (const fromFullId of autoFromFullIds) {
    const autoDep = await createContentDep('auto', fromFullId);
    autoDependencies.push(autoDep);
  }

  return {
    hardDependencies,
    autoDependencies,
  };

  //
  //
  //

  // Skip dependency if it originates from current content item or its child
  function externalFromFullIds(dbDeps: { fromFullId: string }[]) {
    return dbDeps.reduce((ids, dbDep) => {
      const fromFullId = dbDep.fromFullId;
      const isFromSelf = fromFullId === fullId;
      const isFromChild = fromFullId.startsWith(`${fullId}/`);

      if (isFromSelf || isFromChild) {
        return ids;
      }

      ids.push(fromFullId);
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
      eq(ERUDIT.db.schema.contentDeps.fromFullId, fullId),
      like(ERUDIT.db.schema.contentDeps.fromFullId, `${fullId}/%`),
    ),
  });

  // Skip dependent if it targets current content item or its child
  const externalTargetFullIds = dbDependents.reduce((ids, dbDependent) => {
    const toFullId = dbDependent.toFullId;
    const targetsSelf = toFullId === fullId;
    const targetsChild = toFullId.startsWith(`${fullId}/`);

    if (targetsSelf || targetsChild) {
      return ids;
    }

    ids.push(toFullId);
    return ids;
  }, [] as string[]);

  // Order targets according to nav structure
  const targetFullIds = ERUDIT.contentNav.orderIds(externalTargetFullIds);

  return Promise.all(
    targetFullIds.map((targetFullId) => createContentDep('auto', targetFullId)),
  );
}

async function createContentDep(
  type: 'auto',
  fullId: string,
): Promise<ContentAutoDep>;
async function createContentDep(
  type: 'hard',
  fullId: string,
  reason: string,
): Promise<ContentHardDep>;
async function createContentDep(
  type: 'auto' | 'hard',
  fullId: string,
  reason?: string,
): Promise<ContentDep> {
  const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
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
