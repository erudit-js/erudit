export default defineEventHandler(async () => {
    const routes: string[] = [];

    routes.push(...(await pages()));
    routes.push(...(await contentUniques()));
    routes.push(...(await problemScripts()));

    return routes;
});

export async function pages() {
    const routes: string[] = [];

    for (const navNode of ERUDIT.contentNav.id2Node.values()) {
        if (navNode.type === 'topic') {
            const topicParts = await ERUDIT.repository.content.topicParts(
                navNode.fullId,
            );

            for (const part of topicParts) {
                routes.push(PAGES.topic(part, navNode.shortId));
                routes.push(
                    `/api/preview/contentPage/${stringifyContentTypePath(part, navNode.fullId)}.json`,
                );
            }
        } else {
            routes.push(PAGES[navNode.type](navNode.shortId));
            routes.push(
                `/api/preview/contentPage/${stringifyContentTypePath(
                    navNode.type,
                    navNode.fullId,
                )}.json`,
            );
        }
    }
    return routes;
}

export async function contentUniques() {
    const routes: string[] = [];

    const dbUniques = await ERUDIT.db.query.contentUniques.findMany({
        columns: {
            contentFullId: true,
            contentProseType: true,
            uniqueName: true,
        },
    });

    for (const dbUnique of dbUniques) {
        routes.push(
            `/api/preview/contentUnique/${stringifyContentTypePath(dbUnique.contentProseType, dbUnique.contentFullId)}/${dbUnique.uniqueName}.json`,
        );
    }

    return routes;
}

export async function problemScripts() {
    const routes: string[] = [];

    const dbProblemScripts = await ERUDIT.db
        .selectDistinct({
            problemScript: ERUDIT.db.schema.problemScripts.problemScriptSrc,
        })
        .from(ERUDIT.db.schema.problemScripts);

    for (const dbProblemScript of dbProblemScripts) {
        routes.push(
            `/api/problemScript/` +
                dbProblemScript
                    .problemScript!.replace(
                        ERUDIT.config.paths.project + '/',
                        '',
                    )
                    .replace('.tsx', '') +
                '.js',
        );
    }

    return routes;
}
