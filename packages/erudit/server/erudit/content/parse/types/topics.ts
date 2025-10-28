import { type ContentConfigTopic, TopicPart } from '@erudit-js/cog/schema';
import { type DocumentAny, type ParsedJsxContent } from '@erudit-js/prose';

import type { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';
import { documentUrlMismatch, wrapError } from '../utils/error';
import { insertSnippets, insertUniques } from '../utils/element';
import { insertContentConfig } from '../utils/contentConfig';
import { contentParseDataStep } from '../parseData';

export const topicsParser: ContentParser = async () => {
    return {
        step: async (navNode: ContentNavNode) => {
            const parsedParts: Map<TopicPart, ParsedJsxContent> = new Map();

            for (const topicPart of Object.values(TopicPart)) {
                const proseDocumentPath =
                    ERUDIT.config.paths.project +
                    '/content/' +
                    navNode.contentRelPath +
                    '/' +
                    topicPart;

                try {
                    const proseDocument = await ERUDIT.import<DocumentAny>(
                        proseDocumentPath,
                        {
                            default: true,
                            try: true,
                        },
                    );

                    if (!proseDocument) {
                        continue;
                    }

                    if (proseDocument.url !== proseDocumentPath) {
                        throw documentUrlMismatch(
                            proseDocument.url,
                            proseDocumentPath,
                        );
                    }

                    parsedParts.set(
                        topicPart,
                        await ERUDIT.repository.prose.parse(
                            proseDocument.content,
                            (element) =>
                                contentParseDataStep(navNode.fullId, element),
                        ),
                    );
                } catch (error) {
                    throw wrapError(
                        error,
                        `Failed to import/parse ${topicPart}!`,
                    );
                }
            }

            for (const [part, parsed] of parsedParts) {
                await insertUniques(
                    navNode.fullId,
                    part,
                    Object.values(parsed.uniques),
                );

                await insertSnippets(navNode.fullId, part, parsed.snippets);
            }

            let topicModule: { default: ContentConfigTopic } | undefined;

            try {
                topicModule = await ERUDIT.import(
                    ERUDIT.config.paths.project +
                        '/content/' +
                        navNode.contentRelPath +
                        '/topic',
                    { try: true },
                );
            } catch (error) {
                throw wrapError(error, 'Error importing topic module!');
            }

            try {
                await ERUDIT.db.insert(ERUDIT.db.schema.topics).values({
                    fullId: navNode.fullId,
                    article: parsedParts.get(TopicPart.Article)?.parsedTree,
                    summary: parsedParts.get(TopicPart.Summary)?.parsedTree,
                    practice: parsedParts.get(TopicPart.Practice)?.parsedTree,
                });

                await insertContentConfig(navNode, topicModule?.default);
            } catch (error) {
                throw wrapError(error, 'Error inserting topic content!');
            }
        },
    };
};
