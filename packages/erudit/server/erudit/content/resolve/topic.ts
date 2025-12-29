import { eq } from 'drizzle-orm';
import { isDocument, type AnyDocument } from '@jsprose/core';
import {
    topicParts,
    type TopicContentItem,
} from '@erudit-js/core/content/topic';
import { isContentItem } from '@erudit-js/core/content/item';

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
                const resolvedTopicPart = await resolveEruditProse(
                    topicPartDocument.default.content,
                    true,
                    async ({ rawElement }) => {
                        if (topicPart === 'summary') {
                            return;
                        }

                        if (
                            ERUDIT.config.public.project.countElements
                                .flat()
                                .includes(rawElement.schemaName)
                        ) {
                            elementsCount[rawElement.schemaName] =
                                (elementsCount[rawElement.schemaName] || 0) + 1;
                        }
                    },
                );

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
        console.log(error);
    }
}
