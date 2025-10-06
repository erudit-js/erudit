import { eq } from 'drizzle-orm';
import { ContentType, isTopicPart, TopicPart } from '@erudit-js/cog/schema';
import type { BlocksSchema } from '@erudit-js/prose/default/blocks/index';

export default defineEventHandler<Promise<MainContent>>(async (event) => {
    const contentPath = event.context.params!.contentPath;
    const { typeOrPart, shortId } = parseContentPath(contentPath);
    const navNode = ERUDIT.contentNav.getNodeOrThrow(shortId);
    const fullId = navNode.fullId;

    if (typeOrPart === ContentType.Page) {
        const dbPage = (await ERUDIT.db.query.pages.findFirst({
            columns: { blocks: true },
            where: eq(ERUDIT.db.schema.pages.fullId, fullId),
        }))!;

        const { element, storage } =
            await ERUDIT.repository.prose.resolve<BlocksSchema>(dbPage.blocks);

        return {
            type: ContentType.Page,
            breadcrumbs: await ERUDIT.repository.content.breadcrumbs(fullId),
            element,
            storage,
        };
    }

    if (isTopicPart(typeOrPart)) {
        const dbTopicPart = (await ERUDIT.db.query.topics.findFirst({
            columns: { [typeOrPart]: true },
            where: eq(ERUDIT.db.schema.topics.fullId, fullId),
        }))!;

        const { element, storage } =
            await ERUDIT.repository.prose.resolve<BlocksSchema>(
                // @ts-expect-error - we know that typeOrPart is a valid key here
                dbTopicPart[typeOrPart]!,
            );

        return {
            type: ContentType.Topic,
            part: typeOrPart as TopicPart,
            breadcrumbs: await ERUDIT.repository.content.breadcrumbs(fullId),
            element,
            storage,
        };
    }

    throw createError({
        statusCode: 400,
        statusMessage: `Unable to create MainContent for content path: "${contentPath}"!`,
    });
});
