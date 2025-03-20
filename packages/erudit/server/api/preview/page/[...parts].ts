import {
    getContentContext,
    getTopicPartContext,
    getContributorContext,
} from '@erudit/server/plugin/content/context';

import type { LinkTargetPageType } from '@erudit-js/bitran-elements/link/target';

import type { PreviewDataPageLink } from '@app/scripts/preview/data/pageLink';
import type { Context, ContextItem } from '@erudit/shared/content/context';

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

        return <PreviewDataPageLink>{
            type: 'page-link',
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
