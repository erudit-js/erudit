import type { BookContentItem } from '@erudit-js/core/content/book';
import { isContentItem } from '@erudit-js/core/content/item';

import type { ContentNavNode } from '../nav/types';
import { logContentError } from './utils/contentError';
import { insertContentItem } from './utils/insertContentItem';

export async function resolveBook(bookNode: ContentNavNode) {
  ERUDIT.log.debug.start(
    `Resolving book ${ERUDIT.log.stress(bookNode.fullId)}...`,
  );

  try {
    const bookModule = await ERUDIT.import<{ default: BookContentItem }>(
      ERUDIT.paths.project(`content/${bookNode.contentRelPath}/book`),
    );

    if (!isContentItem<BookContentItem>(bookModule?.default, 'book')) {
      throw new Error('Book default export must be a book content item!');
    }

    const bookContentItem = bookModule.default;

    await insertContentItem(bookNode, bookContentItem);
  } catch (error) {
    logContentError(bookNode);
    throw error;
  }
}
