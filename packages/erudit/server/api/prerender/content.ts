import { eq } from 'drizzle-orm';
import { ContentType } from '@erudit-js/cog/schema';

export default defineEventHandler(async () => {
    const navNodes = ERUDIT.contentNav.id2Node.values();

    const routes: string[] = [];

    for (const navNode of navNodes) {
        if (navNode.type === ContentType.Topic) {
            const topicParts = await ERUDIT.repository.content.topicParts(
                navNode.fullId,
            );

            for (const part of topicParts) {
                // The page itself
                routes.push(PAGES.topic(part, navNode.shortId));
                // Preview
                routes.push(
                    `/api/preview/contentPage/${createContentPath(part, navNode.fullId)}.json`,
                );
            }
        } else {
            // The page itself
            routes.push(await ERUDIT.repository.content.link(navNode.shortId));
            // Preview
            routes.push(
                `/api/preview/contentPage/${createContentPath(navNode.type, navNode.fullId)}.json`,
            );
        }
    }

    routes.push(...(await getContentFileRoutes()));

    return routes;
});

//
//
//

async function getContentFileRoutes(): Promise<string[]> {
    const routes: string[] = [];

    const dbContentFiles = await ERUDIT.db.query.contentParseData.findMany({
        columns: { value: true },
        where: eq(ERUDIT.db.schema.contentParseData.type, 'fileSrc'),
    });

    for (const dbContentFile of dbContentFiles) {
        if (
            !dbContentFile.value.startsWith(
                ERUDIT.config.paths.project + '/content/',
            )
        ) {
            throw createError({
                statusCode: 403,
                statusMessage: `Content file path is outside content folder: ${dbContentFile.value}`,
            });
        }

        const contentRelativePath = dbContentFile.value.replace(
            ERUDIT.config.paths.project + '/content/',
            '',
        );

        routes.push(`/content/file/${contentRelativePath}`);
    }

    return routes;
}

async function getProblemGeneratorRoutes(): Promise<string[]> {
    const routes: string[] = [];

    return routes;
}
