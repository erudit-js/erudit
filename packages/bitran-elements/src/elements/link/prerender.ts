import {
    encodeBitranLocation,
    isContentType,
    isTopicPart,
    type EruditBitranRuntime,
} from '@erudit-js/cog/schema';

import {
    getShortContentId,
    serverAbsolutizeContentPath,
} from '@server/repository/contentId';

import type { LinkNode } from './shared';

export function prerenderLink(link: LinkNode, runtime: EruditBitranRuntime) {
    const linkTarget = link.renderData;

    if (!linkTarget) {
        return;
    }

    if (linkTarget.type === 'unique') {
        return `/api/preview/unique/${encodeBitranLocation(linkTarget._absoluteStrLocation!)}`;
    } else if (linkTarget.type === 'page') {
        if (
            isTopicPart(linkTarget.pageType) ||
            isContentType(linkTarget.pageType)
        ) {
            const absoluteContentId = serverAbsolutizeContentPath(
                linkTarget.path!,
                runtime.context.location.path!,
            );

            return `/api/preview/page/${linkTarget.pageType}/${getShortContentId(absoluteContentId)}`;
        }

        switch (linkTarget.pageType) {
            case 'contributor':
                return `/api/preview/page/contributor/${linkTarget.path!}`;
        }
    }
}
