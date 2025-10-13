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

            continue;
        }

        // The page itself
        routes.push(await ERUDIT.repository.content.link(navNode.shortId));
        // Preview
        routes.push(
            `/api/preview/contentPage/${createContentPath(navNode.type, navNode.fullId)}.json`,
        );
    }

    return routes;
});
