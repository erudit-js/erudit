import { isDocument, type AnyDocument } from '@jsprose/core';
import { isContentItem } from '@erudit-js/core/content/item';
import type { PageContentItem } from '@erudit-js/core/content/page';

import type { ContentNavNode } from '../nav/types';
import { logContentError } from './utils/contentError';
import { insertContentItem } from './utils/insertContentItem';
import { resolveEruditProse } from '../../prose/repository/resolve';
import { insertContentResolved } from './utils/insertContentResolved';

export async function resolvePage(pageNode: ContentNavNode) {
    ERUDIT.log.debug.start(
        `Resolving page ${ERUDIT.log.stress(pageNode.fullId)}...`,
    );

    try {
        const pageModule = await ERUDIT.import<{
            default: AnyDocument;
            page: PageContentItem;
        }>(
            ERUDIT.config.paths.project +
                '/content/' +
                pageNode.contentRelPath +
                '/page',
        );

        if (!isContentItem<PageContentItem>(pageModule?.page, 'page')) {
            throw new Error('Page `page` export must be a page content item!');
        }

        if (!isDocument(pageModule?.default)) {
            throw new Error('Page default export must be a Document!');
        }

        await insertContentItem(pageNode, pageModule.page);

        const proseDocument = pageModule.default;
        const resolveResult = await resolveEruditProse(
            proseDocument.content,
            true,
        );

        await ERUDIT.db.insert(ERUDIT.db.schema.pages).values({
            fullId: pageNode.fullId,
            prose: resolveResult.proseElement,
        });

        await insertContentResolved(pageNode.fullId, 'page', resolveResult);
    } catch (error) {
        logContentError(pageNode);
        console.log(error);
    }
}
