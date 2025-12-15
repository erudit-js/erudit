export default defineEventHandler<Promise<MainContent>>(async (event) => {
    const strContentTypePath = event.context.params?.contentTypePath;
    const contentTypePath = parseContentTypePath(strContentTypePath!);
    const navNode = ERUDIT.contentNav.getNodeOrThrow(contentTypePath.contentId);
    const fullContentId = navNode.fullId;

    if (contentTypePath.type === 'page' || contentTypePath.type === 'topic') {
        const proseElement = await ERUDIT.repository.prose.getContent(
            contentTypePath.type === 'topic'
                ? contentTypePath.topicPart
                : contentTypePath.type,
            contentTypePath.contentId,
        );

        const { storage } =
            await ERUDIT.repository.prose.finalize(proseElement);

        if (contentTypePath.type === 'topic') {
            return {
                type: 'topic',
                part: contentTypePath.topicPart,
                breadcrumbs:
                    await ERUDIT.repository.content.breadcrumbs(fullContentId),
                fullId: fullContentId,
                proseElement,
                storage,
            };
        }

        return {
            type: contentTypePath.type,
            breadcrumbs:
                await ERUDIT.repository.content.breadcrumbs(fullContentId),
            fullId: fullContentId,
            proseElement,
            storage,
        };
    }

    return {
        type: contentTypePath.type,
        breadcrumbs: await ERUDIT.repository.content.breadcrumbs(fullContentId),
        fullId: fullContentId,
    };
});
