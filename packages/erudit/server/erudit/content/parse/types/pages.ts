import { ContentType, type ContentConfigPage } from '@erudit-js/cog/schema';
import { type DocumentAny } from '@erudit-js/prose';

import type { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';
import { documentUrlMismatch, wrapError } from '../utils/error';
import { insertSnippets, insertUniques } from '../utils/element';
import { insertContentConfig } from '../utils/contentConfig';

export const pagesParser: ContentParser = async () => {
    return {
        step: async (navNode: ContentNavNode) => {
            let pageModule:
                | { default: ContentConfigPage; document: DocumentAny }
                | undefined;

            const pageModulePath =
                ERUDIT.config.paths.project +
                '/content/' +
                navNode.contentRelPath +
                '/page';

            pageModule = await ERUDIT.import(pageModulePath, { try: true });

            if (!pageModule) {
                return;
            }

            if (!pageModule.document) {
                throw `Page module must have an export field "document"!`;
            }

            if (pageModule.document.url !== pageModulePath) {
                throw documentUrlMismatch(
                    pageModule.document.url,
                    pageModulePath,
                );
            }

            const parsedContent = await ERUDIT.repository.prose.parse(
                pageModule.document.content,
            );

            await insertUniques(
                navNode.fullId,
                ContentType.Page,
                Object.values(parsedContent.uniques),
            );

            await insertSnippets(
                navNode.fullId,
                undefined,
                parsedContent.snippets,
            );

            try {
                await ERUDIT.db.insert(ERUDIT.db.schema.pages).values({
                    fullId: navNode.fullId,
                    blocks: parsedContent.parsedTree,
                });

                await insertContentConfig(navNode, pageModule.default);
            } catch (error) {
                throw wrapError(error, 'Error inserting page content!');
            }
        },
    };
};
