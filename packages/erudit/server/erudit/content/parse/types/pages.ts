import chalk from 'chalk';
import { ContentConfigPage, ContentType } from '@erudit-js/cog/schema';
import { DocumentAny, parseJsxContent } from '@erudit-js/prose';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';
import { documentUrlMismatch, wrapError } from '../utils/error';
import { insertUniques } from '../utils/element';

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
                pageModule = await ERUDIT.import(pageModulePath, {
                    try: true,
                });
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

            try {
                await ERUDIT.db.insert(ERUDIT.db.schema.pages).values({
                    fullId: navNode.fullId,
                    parsedTree: parsedContent.parsedTree,
                });

                await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
                    fullId: navNode.fullId,
                    type: ContentType.Page,
                    title:
                        pageModule.default?.title ||
                        navNode.fullId.split('/').pop()!,
                    navTitle: pageModule.default?.navTitle,
                    description: pageModule.default?.description,
                });
            } catch (error) {
                throw wrapError(error, 'Error inserting page content!');
            }
        },
    };
};
