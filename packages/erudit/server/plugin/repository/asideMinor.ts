import type { ContentType } from '@erudit-js/cog/schema';

import type { NavNode } from '@server/nav/node';
import { getNavNode } from '@server/nav/utils';
import {
    getContentContributors,
    getPreviousNext,
} from '@server/repository/content';

import type { AsideMinorContentBase } from '@shared/aside/minor';

export function getAsideMinorContentNode(
    type: ContentType,
    rawContentId?: string,
) {
    if (!rawContentId) {
        throw createError({
            statusCode: 400,
            message: `Missing "${type}Id" parameter!`,
        });
    }

    const contentNavNode = getNavNode(rawContentId);

    if (contentNavNode.type !== type) {
        throw createError({
            statusCode: 400,
            message: `Provided "${rawContentId}" is not a content ${type}!`,
        });
    }

    return contentNavNode;
}

export async function getAsideMinorContentBase(
    navNode: NavNode,
): Promise<Omit<AsideMinorContentBase, 'type'>> {
    const fullContentId = navNode.fullId;
    const shortContentId = navNode.shortId;
    const fsContentDirectory = navNode.fsPath;
    const contributors = await getContentContributors(fullContentId);
    const previousNext = await getPreviousNext(fullContentId);

    return {
        fullContentId,
        shortContentId,
        fsContentDirectory,
        contributors,
        previousNext,
    };
}
