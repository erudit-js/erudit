import { isDocument, type AnyDocument } from '@jsprose/core';
import { isContentItem } from '@erudit-js/core/content/item';
import type { PageContentItem } from '@erudit-js/core/content/page';
import { isIncludedRawElement } from '@erudit-js/prose';

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
            content: AnyDocument;
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

        if (!isDocument(pageModule?.content)) {
            throw new Error('Page `content` export must be a Document!');
        }

        await insertContentItem(pageNode, pageModule.page);

        const elementsCount: Record<string, number> = {};

        const proseDocument = pageModule.content;
        const resolveResult = await resolveEruditProse(
            proseDocument.content,
            true,
            async ({ rawElement }) => {
                // Counting elements for statistics

                if (isIncludedRawElement(rawElement)) {
                    return;
                }

                if (
                    ERUDIT.config.project.countElements
                        .flat()
                        .includes(rawElement.schemaName)
                ) {
                    elementsCount[rawElement.schemaName] =
                        (elementsCount[rawElement.schemaName] || 0) + 1;
                }
            },
        );

        if (resolveResult.tocItems?.length) {
            await ERUDIT.db.insert(ERUDIT.db.schema.contentToc).values({
                fullId: pageNode.fullId,
                toc: resolveResult.tocItems,
            });
        }

        for (const [schemaName, count] of Object.entries(elementsCount)) {
            await ERUDIT.repository.content.addElementCount(
                pageNode.fullId,
                schemaName,
                count,
            );
        }

        await ERUDIT.db.insert(ERUDIT.db.schema.pages).values({
            fullId: pageNode.fullId,
            prose: resolveResult.proseElement,
        });

        await insertContentResolved(pageNode.fullId, 'page', resolveResult);
    } catch (error) {
        logContentError(pageNode);
        throw error;
    }
}
