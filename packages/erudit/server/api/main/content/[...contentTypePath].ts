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
    const quickLinks =
        await ERUDIT.repository.content.quickLinks(fullContentId);
    const flags = await ERUDIT.repository.content.flags(fullContentId);
    const elementCounts =
        await ERUDIT.repository.content.elementCounts(fullContentId);
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

    if (elementCounts) {
        mainContentBase.elementCounts = elementCounts;
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
        const quickLinks = await ERUDIT.repository.content.quickLinks(
            childNode.fullId,
        );

        const child: MainContentChildrenItem = {
            type,
            link,
            title,
        };

        if (description) {
            child.description = description;
        }

        if (quickLinks) {
            child.quickLinks = quickLinks;
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
