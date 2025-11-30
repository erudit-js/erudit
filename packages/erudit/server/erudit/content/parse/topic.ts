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

export async function parseTopic(topicNode: ContentNavNode) {
    ERUDIT.log.debug.start(
        `Parsing topic ${ERUDIT.log.stress(topicNode.fullId)}...`,
    );

    try {
        const topicModule = await ERUDIT.import<{ default: TopicContentItem }>(
            ERUDIT.config.paths.project +
                '/content/' +
                topicNode.contentRelPath +
                '/topic',
        );

        if (!isContentItem(topicModule?.default, 'topic')) {
            throw new Error(
                'Topic default export must be a topic content item!',
            );
        }

        await insertContentItem(topicNode, topicModule.default);
        await ERUDIT.db.insert(ERUDIT.db.schema.topics).values({
            fullId: topicNode.fullId,
        });

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
    } catch (error) {
        logContentError(topicNode);
        console.log(error);
    }
}
