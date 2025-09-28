import { ContentConfigPage } from '@erudit-js/cog/schema';
import { DocumentAny, parseJsxContent } from '@erudit-js/prose';

import { ContentParser } from '..';
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

            try {
                pageModule = await ERUDIT.import(pageModulePath, { try: true });
            } catch (error) {
                throw wrapError(error, `Failed to import page module!`);
            }

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

            const parsedContent = await parseJsxContent({
                content: pageModule.document.content,
                context: {
                    language: ERUDIT.config.public.project.language.current,
                },
            });

            await insertUniques(
                navNode.fullId,
                undefined,
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
                    parsedTree: parsedContent.parsedTree,
                });

                await insertContentConfig(navNode, pageModule.default);
            } catch (error) {
                throw wrapError(error, 'Error inserting page content!');
            }
        },
    };
};
