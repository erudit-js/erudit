import type { LinkTargetPageType } from '@erudit-js/bitran-elements/link/target';
import { isContentType } from '@erudit-js/cog/schema';

import {
    getContentContext,
    getTopicPartContext,
    getContributorContext,
} from '@server/content/context';
import { getFullContentId } from '@server/repository/contentId';
import { ERUDIT_SERVER } from '@server/global';
import { DbContent } from '@server/db/entities/Content';

import type { Context, ContextItem } from '@erudit/shared/content/context';
import type { PreviewDataPageLink } from '@app/scripts/preview/data/pageLink';

export default defineEventHandler<Promise<PreviewDataPageLink>>(
    async (event) => {
        const urlParts = (event.context.params?.parts || '').split('/');
        const pageType: LinkTargetPageType = urlParts.shift() as any;
        const contentId: string = urlParts.join('/');

        const context: Context = await (async () => {
            switch (pageType) {
                case 'book':
                case 'group':
                    return await getContentContext(contentId);
                case 'article':
                case 'summary':
                case 'practice':
                    return await getTopicPartContext(pageType, contentId);
                case 'contributor':
                    return await getContributorContext(contentId);
            }

            throw createError(`Can't handle "${pageType as any}" page type!`);
        })();

        const lastContextItem = context.pop() as ContextItem;
        const contextStr = context
            .filter((c) => !c.hidden)
            .map((c) => c.title)
            .join(' / ');

        const description = await (async () => {
            if (!isContentType(pageType)) {
                return;
            }

            const fullContentId = await getFullContentId(contentId);
            const dbContent = await ERUDIT_SERVER.DB.manager.findOne(
                DbContent,
                {
                    select: ['description'],
                    where: { contentId: fullContentId },
                },
            );

            if (!dbContent) {
                return;
            }

            return dbContent.description?.trim();
        })();

        return <PreviewDataPageLink>{
            type: 'page-link',
            description,
            footer: {
                secondary:
                    (contextStr ? contextStr + ' • ' : '') +
                    lastContextItem.type,
                primary: lastContextItem.title,
                href: lastContextItem.href,
                iconName: lastContextItem.icon,
            },
        };
    },
);
