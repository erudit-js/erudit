export default defineEventHandler<Promise<MainContent>>(async (event) => {
    const strContentTypePath = event.context.params?.contentTypePath;
    const contentTypePath = parseContentTypePath(strContentTypePath!);
    const navNode = ERUDIT.contentNav.getNodeOrThrow(contentTypePath.contentId);
    const fullContentId = navNode.fullId;
    const title = await ERUDIT.repository.content.title(fullContentId);
    const description =
        await ERUDIT.repository.content.description(fullContentId);
    const decoration =
        await ERUDIT.repository.content.decoration(fullContentId);
    const quickLinks =
        await ERUDIT.repository.content.quickLinks(fullContentId);
    const flags = await ERUDIT.repository.content.flags(fullContentId);
    const stats = await ERUDIT.repository.content.stats(fullContentId);
    const connections =
        await ERUDIT.repository.content.connections(fullContentId);

    //
    // Base
    //
    const mainContentBase: Omit<MainContentBase, 'type'> = {
        fullId: fullContentId,
        title,
        breadcrumbs: await ERUDIT.repository.content.breadcrumbs(fullContentId),
    };

    if (description) {
        mainContentBase.description = description;
    }

    if (decoration) {
        mainContentBase.decoration = decoration;
    }

    if (flags) {
        mainContentBase.flags = flags;
    }

    if (stats) {
        mainContentBase.stats = stats;
    }

    if (connections) {
        mainContentBase.connections = connections;
    }

    if (contentTypePath.type === 'page' || contentTypePath.type === 'topic') {
        const proseElement = await ERUDIT.repository.prose.getContent(
            contentTypePath.type === 'topic'
                ? contentTypePath.topicPart
                : contentTypePath.type,
            fullContentId,
        );

        const topicParts =
            await ERUDIT.repository.content.topicParts(fullContentId);

        const { storage } =
            await ERUDIT.repository.prose.finalize(proseElement);

        //
        // Topic
        //
        if (contentTypePath.type === 'topic') {
            const mainContentTopicPart: MainContentTopicPart = {
                ...mainContentBase,
                type: 'topic',
                shortContentId: navNode.shortId,
                part: contentTypePath.topicPart,
                parts: topicParts,
                proseElement,
                storage,
            };

            if (quickLinks) {
                mainContentTopicPart.quickLinks = quickLinks;
            }

            return mainContentTopicPart;
        }

        //
        // Page
        //

        const mainContentPage: MainContentPage = {
            ...mainContentBase,
            type: 'page',
            proseElement,
            storage,
        };

        if (quickLinks) {
            mainContentPage.quickLinks = quickLinks;
        }

        return mainContentPage;
    }

    //
    // Rest content types
    //
    return {
        ...mainContentBase,
        type: contentTypePath.type,
        children: await ERUDIT.repository.content.children(fullContentId),
    } satisfies MainContentGroup | MainContentBook;
});
