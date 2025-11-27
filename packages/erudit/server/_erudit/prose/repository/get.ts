import { eq } from 'drizzle-orm';

import { ContentType, isTopicPart } from '@erudit-js/cog/schema';
import type { ParsedElement } from '@erudit-js/prose';
import type { BlocksSchema } from '@erudit-js/prose/default/blocks/index';

export async function getProseFor(
    contentPath: string,
): Promise<ParsedElement<BlocksSchema>> {
    const { fullOrShortId, typeOrPart } = parseContentPath(contentPath);
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullOrShortId);
    const fullId = navNode.fullId;

    if (isTopicPart(typeOrPart)) {
        const dbTopic = (await ERUDIT.db.query.topics.findFirst({
            columns: {
                [typeOrPart]: true,
            },
            where: eq(ERUDIT.db.schema.topics.fullId, fullId),
        }))!;

        // @ts-expect-error we know that typeOrPart is a valid key here
        return dbTopic[typeOrPart];
    }

    if (typeOrPart === ContentType.Page) {
        const dbPage = (await ERUDIT.db.query.pages.findFirst({
            columns: {
                blocks: true,
            },
            where: eq(ERUDIT.db.schema.pages.fullId, fullId),
        }))!;

        return dbPage.blocks;
    }

    throw createError({
        statusCode: 400,
        statusMessage: `Unable to get prose for content path "${contentPath}"!`,
    });
}
