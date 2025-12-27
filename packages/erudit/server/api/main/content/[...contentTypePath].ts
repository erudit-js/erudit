import { eq } from 'drizzle-orm';

export default defineEventHandler<Promise<MainContent>>(async (event) => {
    const strContentTypePath = event.context.params?.contentTypePath;
    const contentTypePath = parseContentTypePath(strContentTypePath!);
    const navNode = ERUDIT.contentNav.getNodeOrThrow(contentTypePath.contentId);
    const fullContentId = navNode.fullId;
    const title = await ERUDIT.repository.content.title(fullContentId);
    const description = await getContentDescription(fullContentId);
    const decoration =
        await ERUDIT.repository.content.decoration(fullContentId);

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

    if (contentTypePath.type === 'page' || contentTypePath.type === 'topic') {
        const proseElement = await ERUDIT.repository.prose.getContent(
            contentTypePath.type === 'topic'
                ? contentTypePath.topicPart
                : contentTypePath.type,
            contentTypePath.contentId,
        );

        const { storage } =
            await ERUDIT.repository.prose.finalize(proseElement);

        //
        // Topic
        //
        if (contentTypePath.type === 'topic') {
            return {
                ...mainContentBase,
                type: 'topic',
                part: contentTypePath.topicPart,
                proseElement,
                storage,
            } satisfies MainContentTopicPart;
        }

        //
        // Page
        //
        return {
            ...mainContentBase,
            type: contentTypePath.type,
            proseElement,
            storage,
        } satisfies MainContentPage;
    }

    //
    // Rest content types
    //
    return {
        ...mainContentBase,
        type: contentTypePath.type,
        children: await getContentChildren(fullContentId),
    } satisfies MainContentGroup | MainContentBook;
});

async function getContentChildren(
    fullContentId: string,
): Promise<MainContentChildrenItem[]> {
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullContentId);
    const children: MainContentChildrenItem[] = [];

    for (const childNode of navNode.children ?? []) {
        const type = childNode.type;
        const link = await ERUDIT.repository.content.link(childNode.fullId);
        const title = await ERUDIT.repository.content.title(childNode.fullId);
        const description = await getContentDescription(childNode.fullId);

        const child: MainContentChildrenItem = {
            type,
            link,
            title,
        };

        if (description) {
            child.description = description;
        }

        children.push(child);
    }

    return children;
}

async function getContentDescription(
    fullContentId: string,
): Promise<string | undefined> {
    const dbContentItem = (await ERUDIT.db.query.content.findFirst({
        where: eq(ERUDIT.db.schema.content.fullId, fullContentId),
    }))!;

    return dbContentItem.description || undefined;
}
