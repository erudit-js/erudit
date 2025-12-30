import { eq, like, or } from 'drizzle-orm';

export async function getContentDependencies(fullId: string): Promise<{
    hardDependencies: ContentHardDep[];
    autoDependencies: ContentAutoDep[];
}> {
    const hardDependencies: ContentHardDep[] = [];
    const autoDependencies: ContentAutoDep[] = [];

    const dbContents = await ERUDIT.db.query.contentDeps.findMany({
        columns: { fromFullId: true, toFullId: true, hard: true, reason: true },
        where: or(
            eq(ERUDIT.db.schema.contentDeps.toFullId, fullId),
            like(ERUDIT.db.schema.contentDeps.toFullId, `${fullId}/%`),
        ),
    });

    for (const dbContent of dbContents) {
        // Skip child-only self-references
        const isToChild = dbContent.toFullId.startsWith(`${fullId}/`);
        const isFromChild = dbContent.fromFullId.startsWith(`${fullId}/`);
        if (isToChild && isFromChild) {
            continue;
        }

        const dep = await getContentAutoDep(dbContent.fromFullId);

        if (dbContent.hard && fullId === dbContent.toFullId) {
            hardDependencies.push({
                ...dep,
                type: 'hard',
                reason: dbContent.reason!,
            });
        } else {
            autoDependencies.push(dep);
        }
    }

    return { hardDependencies, autoDependencies };
}

export async function getContentDependents(
    fullId: string,
): Promise<ContentAutoDep[]> {
    const dependents: ContentAutoDep[] = [];

    const dbContents = await ERUDIT.db.query.contentDeps.findMany({
        columns: { fromFullId: true, toFullId: true },
        where: or(
            eq(ERUDIT.db.schema.contentDeps.fromFullId, fullId),
            like(ERUDIT.db.schema.contentDeps.fromFullId, `${fullId}/%`),
        ),
    });

    for (const dbContent of dbContents) {
        // Skip child-only self-references
        const isFromChild = dbContent.fromFullId.startsWith(`${fullId}/`);
        const isToChild = dbContent.toFullId.startsWith(`${fullId}/`);
        if (isFromChild && isToChild) {
            continue;
        }

        const dep = await getContentAutoDep(dbContent.toFullId);
        dependents.push(dep);
    }

    return dependents;
}

export async function getContentAutoDep(
    fullId: string,
): Promise<ContentAutoDep> {
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
    const contentType = navNode.type;
    const title = await ERUDIT.repository.content.title(fullId);
    const link = await ERUDIT.repository.content.link(fullId);

    return {
        type: 'auto',
        contentType,
        title,
        link,
    };
}
