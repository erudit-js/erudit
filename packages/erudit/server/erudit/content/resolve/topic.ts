import { eq } from 'drizzle-orm';
import {
  isDocument,
  isRawElement,
  walkElements,
  type AnyDocument,
  type AnySchema,
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
      ERUDIT.paths.project(`content/${topicNode.contentRelPath}/topic`),
    );

    if (!isContentItem<TopicContentItem>(topicModule?.default, 'topic')) {
      throw new Error('Topic default export must be a topic content item!');
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
        ERUDIT.paths.project(
          `content/${topicNode.contentRelPath}/${topicPart}`,
        ),
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
                (rawElement as EruditRawElement<AnySchema>).title &&
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
                    title: (rawElement as EruditRawElement<AnySchema>).title!,
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
              ERUDIT.config.countElements.flat().includes(rawElement.schemaName)
            ) {
              elementsCount[rawElement.schemaName] =
                (elementsCount[rawElement.schemaName] || 0) + 1;
            }
          },
        );

        let finalTocItems = resolvedTopicPart.tocItems;

        if (topicPart === 'practice' && practiceProblemsTocItems.length) {
          // Map elementId -> TocItem for both headings and problems
          const itemMap = new Map<string, ResolvedTocItem>();

          // Collect all existing TOC items (headings) recursively
          const collectItems = (items: ResolvedTocItem[]) => {
            for (const item of items) {
              if (item.elementId) {
                itemMap.set(item.elementId, item);
              }
              if (item.type === 'heading' && item.children?.length) {
                collectItems(item.children);
              }
            }
          };
          collectItems(resolvedTopicPart.tocItems || []);

          // Add practice problems to the map
          practiceProblemsTocItems.forEach((p) => {
            if (p.elementId) {
              itemMap.set(p.elementId, p);
            }
          });

          // Rebuild TOC in document order using walkElements
          const result: ResolvedTocItem[] = [];
          const stack: ResolvedTocItem[] = [];

          await walkElements(resolvedTopicPart.proseElement, (element) => {
            if (element.id && itemMap.has(element.id)) {
              const item = itemMap.get(element.id)!;

              if (item.type === 'heading') {
                // Pop headings at same or deeper level
                while (stack.length > 0) {
                  const last = stack[stack.length - 1]!;
                  if (last.type === 'heading' && last.level >= item.level) {
                    stack.pop();
                  } else {
                    break;
                  }
                }

                // Create new heading with empty children array
                const newItem: ResolvedTocItem = {
                  ...item,
                  children: [],
                };

                // Add to parent heading or root
                if (stack.length > 0) {
                  const parent = stack[stack.length - 1]!;
                  if (parent.type === 'heading') {
                    parent.children.push(newItem);
                  }
                } else {
                  result.push(newItem);
                }

                stack.push(newItem);
              } else {
                // Non-heading item (problems, etc.)
                if (stack.length > 0) {
                  const parent = stack[stack.length - 1]!;
                  if (parent.type === 'heading') {
                    parent.children.push(item);
                  } else {
                    result.push(item);
                  }
                } else {
                  result.push(item);
                }
              }
            }
          });

          finalTocItems = result;
        }

        if (finalTocItems?.length) {
          await ERUDIT.db.insert(ERUDIT.db.schema.contentToc).values({
            fullId: topicNode.fullId,
            topicPart,
            toc: finalTocItems,
          });
        }

        await ERUDIT.db
          .update(ERUDIT.db.schema.topics)
          .set({
            [topicPart]: resolvedTopicPart.proseElement,
          })
          .where(eq(ERUDIT.db.schema.topics.fullId, topicNode.fullId));

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
