import { ContentType, isTopicPart, TopicPart } from '@erudit-js/cog/schema';

export default defineEventHandler<Promise<MainContent>>(async (event) => {
    const contentPath = event.context.params!.contentPath;
    const { typeOrPart, fullOrShortId: shortId } =
        parseContentPath(contentPath);
    const navNode = ERUDIT.contentNav.getNodeOrThrow(shortId);
    const fullId = navNode.fullId;
    const proseBlocks = await ERUDIT.repository.prose.get(contentPath);
    const { element, storage } =
        await ERUDIT.repository.prose.resolve(proseBlocks);

    if (isTopicPart(typeOrPart)) {
        return {
            type: ContentType.Topic,
            part: typeOrPart as TopicPart,
            breadcrumbs: await ERUDIT.repository.content.breadcrumbs(fullId),
            element,
            storage,
        };
    } else {
        return {
            type: typeOrPart as ContentType.Page,
            breadcrumbs: await ERUDIT.repository.content.breadcrumbs(fullId),
            element,
            storage,
        };
    }
});
