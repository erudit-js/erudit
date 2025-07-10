import { getNavNode } from '@server/nav/utils';
import { createContentLink } from '@server/repository/link';

export async function getReadLink(mixedContentId: string): Promise<string> {
    const navNode = getNavNode(mixedContentId);

    if (!navNode.children || navNode.children.length === 0) {
        throw createError({
            statusCode: 404,
            statusText: `Missing children to create read link for content ID "${mixedContentId}"!`,
        });
    }

    const targetId = navNode.children[0]!.fullId;

    return await createContentLink(targetId);
}
