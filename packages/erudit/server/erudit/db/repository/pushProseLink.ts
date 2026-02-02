import {
  isContentProseType,
  type ContentProseType,
} from '@erudit-js/core/content/prose';
import type { ProseLink } from '@erudit-js/core/prose/link';

export async function pushProseLink(
  contentFullId: string,
  contentProseType: ContentProseType,
  proseLink: ProseLink,
): Promise<void> {
  let toContentId: string | undefined;
  let toContentProseType: ContentProseType | undefined;

  switch (proseLink.type) {
    case 'contentItem':
      toContentId = proseLink.itemId.contentId;
      isContentProseType(proseLink.itemId.type) &&
        (toContentProseType = proseLink.itemId.type);
      break;
    case 'document':
    case 'unique':
      if (proseLink.documentId.type === 'contentPage') {
        toContentId = proseLink.documentId.contentId;
        toContentProseType = 'page';
      } else if (proseLink.documentId.type === 'contentTopic') {
        toContentId = proseLink.documentId.contentId;
        toContentProseType = proseLink.documentId.topicPart;
      }
      break;
  }

  await ERUDIT.db.insert(ERUDIT.db.schema.contentProseLinks).values({
    fromContentId: contentFullId,
    fromContentProseType: contentProseType,
    toContentId,
    toContentProseType,
    proseLink,
  });
}
