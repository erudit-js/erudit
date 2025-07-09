import { trailingSlash } from '@erudit/utils/url';

import type { QuickLinks } from '@shared/quickLink';
import { createContentLink } from '@shared/link';

import { ERUDIT_SERVER } from '@server/global';
import { DbQuickLink } from '@server/db/entities/QuickLink';
import { getNavNode } from '@server/nav/utils';
import { getFullContentId } from '@server/repository/contentId';

export async function getQuickLinks(
    mixedContentId: string,
): Promise<QuickLinks> {
    const fullContentId = getFullContentId(mixedContentId);
    const dbTags = await ERUDIT_SERVER.DB.manager.find(DbQuickLink, {
        where: { contentId: fullContentId },
    });

    return dbTags.map((dbTag) => {
        const navNode = getNavNode(dbTag.contentId);

        const link =
            trailingSlash(
                createContentLink(dbTag.contentType as any, navNode.shortId),
                false,
            ) +
            '#' +
            dbTag.elementId;

        return {
            label: dbTag.label,
            elementName: dbTag.elementName,
            link,
        };
    });
}
