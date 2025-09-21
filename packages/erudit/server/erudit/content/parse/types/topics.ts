import {
    ContentConfigTopic,
    ContentType,
    TopicPart,
} from '@erudit-js/cog/schema';
import {
    DocumentAny,
    ParsedJsxContent,
    parseJsxContent,
} from '@erudit-js/prose';

import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';
import { documentUrlMismatch, wrapError } from '../utils/error';
import { insertUniques } from '../utils/element';

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
                        await parseJsxContent({
                            content: proseDocument.content,
                            context: {
                                language:
                                    ERUDIT.config.public.project.language
                                        .current,
                            },
                        }),
                    );
                } catch (error) {
                    throw wrapError(
                        error,
                        `Failed to import/parse ${topicPart}!`,
                    );
                }
            }

            if (parsedParts.size === 0) {
                ERUDIT.log.warn(
                    `Topic ${ERUDIT.log.stress(
                        navNode.fullId,
                    )} has no article, no summary and no practice!`,
                );
                return;
            }

            for (const [part, parsed] of parsedParts) {
                await insertUniques(
                    navNode.fullId,
                    part,
                    Object.values(parsed.uniques),
                );
            }

            let topicModule: ContentConfigTopic | undefined;

            try {
                topicModule = await ERUDIT.import(
                    ERUDIT.config.paths.project +
                        '/content/' +
                        navNode.contentRelPath +
                        '/topic',
                    { default: true, try: true },
                );
            } catch (error) {
                throw wrapError(error, 'Error importing topic module!');
            }

            if (!topicModule) {
                return;
            }

            try {
                await ERUDIT.db.insert(ERUDIT.db.schema.topics).values({
                    fullId: navNode.fullId,
                    parsedArticle: parsedParts.get(TopicPart.Article)
                        ?.parsedTree,
                    parsedSummary: parsedParts.get(TopicPart.Summary)
                        ?.parsedTree,
                    parsedPractice: parsedParts.get(TopicPart.Practice)
                        ?.parsedTree,
                });

                await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
                    fullId: navNode.fullId,
                    type: ContentType.Topic,
                    title:
                        topicModule?.title || navNode.fullId.split('/').pop()!,
                    navTitle: topicModule?.navTitle,
                    description: topicModule?.description,
                });
            } catch (error) {
                throw wrapError(error, 'Error inserting topic content!');
            }
        },
    };
};
