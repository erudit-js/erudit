import { eq } from 'drizzle-orm';
import { isDocument, type Document } from 'tsprose';
import {
  topicParts,
  type TopicContentItem,
} from '@erudit-js/core/content/topic';
import { isContentItem } from '@erudit-js/core/content/item';

import type { ContentNavNode } from '../nav/types';
import { logContentError } from './utils/contentError';
import { insertContentItem } from './utils/insertContentItem';
import { insertContentResolved } from './utils/insertContentResolved';
import { problemSchema } from '@erudit-js/prose/elements/problem/problem';
import { problemsSchema } from '@erudit-js/prose/elements/problem/problems';

export async function resolveTopic(topicNode: ContentNavNode) {
  ERUDIT.log.debug.start(
    `Resolving topic ${ERUDIT.log.stress(topicNode.fullId)}...`,
  );

  try {
    const topicModule = await ERUDIT.import<{ default: TopicContentItem }>(
      ERUDIT.paths.project(`content/${topicNode.contentRelPath}/topic`),
    );

    if (!isContentItem<TopicContentItem>(topicModule?.default, 'topic')) {
      throw new Error('Topic default export must be a topic content item!');
    }

    await insertContentItem(topicNode, topicModule.default);
    await ERUDIT.db.insert(ERUDIT.db.schema.topics).values({
      fullId: topicNode.fullId,
    });

    for (const topicPart of topicParts) {
      const topicPartDocument = await ERUDIT.import<{
        default: Document;
      }>(
        ERUDIT.paths.project(
          `content/${topicNode.contentRelPath}/${topicPart}`,
        ),
        { try: true },
      );

      if (isDocument(topicPartDocument?.default)) {
        const result = await ERUDIT.repository.prose.fromRaw({
          rawProse: topicPartDocument.default.rawProse,
          toc: {
            enabled: true,
            addSchemas:
              topicPart === 'practice'
                ? [problemSchema, problemsSchema]
                : undefined,
          },
          snippets: { enabled: true },
        });

        if (result.toc?.length) {
          await ERUDIT.db.insert(ERUDIT.db.schema.contentToc).values({
            fullId: topicNode.fullId,
            topicPart,
            toc: result.toc,
          });
        }

        await ERUDIT.repository.content.updateSchemaCounts(
          topicNode.fullId,
          result.schemaCounts,
        );

        await ERUDIT.db
          .update(ERUDIT.db.schema.topics)
          .set({
            [topicPart]: result.prose,
          })
          .where(eq(ERUDIT.db.schema.topics.fullId, topicNode.fullId));

        await insertContentResolved(topicNode.fullId, topicPart, result);
      }
    }
  } catch (error) {
    logContentError(topicNode);
    throw error;
  }
}
