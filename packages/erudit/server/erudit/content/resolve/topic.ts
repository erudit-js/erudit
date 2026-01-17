import { eq } from 'drizzle-orm';
import {
    isDocument,
    isProseElement,
    isRawElement,
    walkElements,
    type AnyDocument,
    type AnySchema,
    type ProseElement,
    type RawElement,
} from '@jsprose/core';
import {
    topicParts,
    type TopicContentItem,
} from '@erudit-js/core/content/topic';
import { isContentItem } from '@erudit-js/core/content/item';
import {
    isIncludedRawElement,
    type EruditRawElement,
    type ResolvedTocItem,
} from '@erudit-js/prose';
import { problemSchema } from '@erudit-js/prose/elements/problem/problem';
import { problemsSchema } from '@erudit-js/prose/elements/problem/problems';

import type { ContentNavNode } from '../nav/types';
import { logContentError } from './utils/contentError';
import { insertContentItem } from './utils/insertContentItem';
import { resolveEruditProse } from '../../prose/repository/resolve';
import { insertContentResolved } from './utils/insertContentResolved';

export async function resolveTopic(topicNode: ContentNavNode) {
    ERUDIT.log.debug.start(
        `Resolving topic ${ERUDIT.log.stress(topicNode.fullId)}...`,
    );

    try {
        const topicModule = await ERUDIT.import<{ default: TopicContentItem }>(
            ERUDIT.config.paths.project +
                '/content/' +
                topicNode.contentRelPath +
                '/topic',
        );

        if (!isContentItem<TopicContentItem>(topicModule?.default, 'topic')) {
            throw new Error(
                'Topic default export must be a topic content item!',
            );
        }

        await insertContentItem(topicNode, topicModule.default);
        await ERUDIT.db.insert(ERUDIT.db.schema.topics).values({
            fullId: topicNode.fullId,
        });

        const elementsCount: Record<string, number> = {};

        for (const topicPart of topicParts) {
            const topicPartDocument = await ERUDIT.import<{
                default: AnyDocument;
            }>(
                ERUDIT.config.paths.project +
                    '/content/' +
                    topicNode.contentRelPath +
                    '/' +
                    topicPart,
                { try: true },
            );

            if (isDocument(topicPartDocument?.default)) {
                const practiceProblemsTocItems: ResolvedTocItem[] = [];

                const resolvedTopicPart = await resolveEruditProse(
                    topicPartDocument.default.content,
                    true,
                    async ({ rawElement, proseElement }) => {
                        //
                        // Auto-adding problems to TOC if in practice topic part
                        //

                        if (topicPart === 'practice') {
                            if (
                                (rawElement as EruditRawElement<AnySchema>)
                                    .title &&
                                proseElement.id
                            ) {
                                if (
                                    isRawElement(rawElement, problemSchema) ||
                                    isRawElement(rawElement, problemsSchema)
                                ) {
                                    practiceProblemsTocItems.push({
                                        type: 'element',
                                        elementId: proseElement.id,
                                        schemaName: rawElement.schemaName,
                                        title: (
                                            rawElement as EruditRawElement<AnySchema>
                                        ).title!,
                                    });
                                }
                            }
                        }

                        //
                        // Counting elements for statistics
                        //

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

                if (
                    resolvedTopicPart.tocItems?.length ||
                    (topicPart === 'practice' &&
                        practiceProblemsTocItems.length)
                ) {
                    let tocItems = resolvedTopicPart.tocItems || [];

                    if (topicPart === 'practice') {
                        // Combine regular toc items with practice problems
                        const combined = [
                            ...tocItems,
                            ...practiceProblemsTocItems,
                        ];

                        // Deduplicate based on elementId
                        const seen = new Set<string>();
                        tocItems = combined.filter((item) => {
                            if (item.type === 'element' && item.elementId) {
                                if (seen.has(item.elementId)) {
                                    return false;
                                }
                                seen.add(item.elementId);
                                return true;
                            }
                            return true;
                        });
                    }

                    await ERUDIT.db.insert(ERUDIT.db.schema.contentToc).values({
                        fullId: topicNode.fullId,
                        topicPart,
                        toc: tocItems,
                    });
                }

                await ERUDIT.db
                    .update(ERUDIT.db.schema.topics)
                    .set({
                        [topicPart]: resolvedTopicPart.proseElement,
                    })
                    .where(
                        eq(ERUDIT.db.schema.topics.fullId, topicNode.fullId),
                    );

                await insertContentResolved(
                    topicNode.fullId,
                    topicPart,
                    resolvedTopicPart,
                );
            }
        }

        for (const [schemaName, count] of Object.entries(elementsCount)) {
            await ERUDIT.repository.content.addElementCount(
                topicNode.fullId,
                schemaName,
                count,
            );
        }
    } catch (error) {
        logContentError(topicNode);
        //console.log(error);
        throw error;
    }
}
