import chalk from 'chalk';
import { ContentConfigPage, ContentType } from '@erudit-js/cog/schema';
import { DocumentAny, parseJsxContent } from '@erudit-js/prose';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';

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
            } catch (err) {
                throw `Failed to import page module: ${err}`;
            }

            if (!pageModule) {
                return;
            }

            if (!pageModule.document) {
                throw `Page module must have an export field "document"!`;
            }

            if (pageModule.document.url !== pageModulePath) {
                throw (
                    `Document url mismatch for page in ${ERUDIT.log.stress(navNode.contentRelPath)}:\n` +
                    `Expected: ${pageModulePath}\n` +
                    `Actual: ${pageModule.document.url}\n` +
                    chalk.yellow(
                        'Make sure you use "meta.import.url" for "url" property in your JSX documents!',
                    )
                );
            }

            const parsedContent = await parseJsxContent({
                content: pageModule.document.content,
                context: {
                    language: ERUDIT.config.public.project.language.current,
                },
            });

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
                throw 'Error inserting page content for: ' + error;
            }
        },
    };
};
