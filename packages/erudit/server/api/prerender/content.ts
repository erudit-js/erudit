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
                    `/api/preview/contentPage/${navNode.shortId}...${part}`,
                );
            }

            continue;
        }

        // The page itself
        routes.push(await ERUDIT.repository.content.link(navNode.fullId));
        // Preview
        routes.push(
            `/api/preview/contentPage/${navNode.shortId}...${navNode.type}`,
        );
    }

    return routes;
});
