import { eq, like, or } from 'drizzle-orm';

type ContentAutoDepCache = Map<string, Promise<ContentAutoDep>>;

async function buildContentAutoDep(fullId: string): Promise<ContentAutoDep> {
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
    const contentType = navNode.type;
    const [title, link] = await Promise.all([
        ERUDIT.repository.content.title(fullId),
        ERUDIT.repository.content.link(fullId),
    ]);

    return {
        type: 'auto',
        contentType,
        title,
        link,
    };
}

function getContentAutoDepCached(
    fullId: string,
    cache: ContentAutoDepCache,
): Promise<ContentAutoDep> {
    const existing = cache.get(fullId);
    if (existing) {
        return existing;
    }

    const created = buildContentAutoDep(fullId);
    cache.set(fullId, created);
    return created;
}

export async function getContentDependencies(fullId: string): Promise<{
    hardDependencies: ContentHardDep[];
    autoDependencies: ContentAutoDep[];
}> {
    const hardDependencies: ContentHardDep[] = [];
    const autoDependencies: ContentAutoDep[] = [];
    const cache: ContentAutoDepCache = new Map();

    const dbContents = await ERUDIT.db.query.contentDeps.findMany({
        columns: { fromFullId: true, toFullId: true, hard: true, reason: true },
        where: or(
            eq(ERUDIT.db.schema.contentDeps.toFullId, fullId),
            like(ERUDIT.db.schema.contentDeps.toFullId, `${fullId}/%`),
        ),
    });

    const filtered = dbContents.filter((dbContent) => {
        // Skip child-only self-references
        const isToChild = dbContent.toFullId.startsWith(`${fullId}/`);
        const isFromChild = dbContent.fromFullId.startsWith(`${fullId}/`);
        return !(isToChild && isFromChild);
    });

    // Precompute to ensure hard deps always take precedence, regardless of DB row ordering.
    const hardDepFromIds = new Set(
        filtered
            .filter(
                (dbContent) => dbContent.hard && fullId === dbContent.toFullId,
            )
            .map((dbContent) => dbContent.fromFullId),
    );

    const deps = await Promise.all(
        filtered.map((dbContent) =>
            getContentAutoDepCached(dbContent.fromFullId, cache),
        ),
    );

    for (const [i, dbContent] of filtered.entries()) {
        const dep = deps[i]!;

        if (dbContent.hard && fullId === dbContent.toFullId) {
            hardDependencies.push({
                ...dep,
                type: 'hard',
                reason: dbContent.reason!,
            });
        } else if (!hardDepFromIds.has(dbContent.fromFullId)) {
            autoDependencies.push(dep);
        }
    }

    return { hardDependencies, autoDependencies };
}

export async function getContentDependents(
    fullId: string,
): Promise<ContentAutoDep[]> {
    const cache: ContentAutoDepCache = new Map();

    const dbContents = await ERUDIT.db.query.contentDeps.findMany({
        columns: { fromFullId: true, toFullId: true },
        where: or(
            eq(ERUDIT.db.schema.contentDeps.fromFullId, fullId),
            like(ERUDIT.db.schema.contentDeps.fromFullId, `${fullId}/%`),
        ),
    });

    const filtered = dbContents.filter((dbContent) => {
        // Skip child-only self-references
        const isFromChild = dbContent.fromFullId.startsWith(`${fullId}/`);
        const isToChild = dbContent.toFullId.startsWith(`${fullId}/`);
        return !(isFromChild && isToChild);
    });

    const deps = await Promise.all(
        filtered.map((dbContent) =>
            getContentAutoDepCached(dbContent.toFullId, cache),
        ),
    );

    return deps;
}

export async function getContentAutoDep(
    fullId: string,
): Promise<ContentAutoDep> {
    return buildContentAutoDep(fullId);
}
