import { isDocument, type Document } from 'tsprose';
import { isContentItem } from '@erudit-js/core/content/item';
import type { PageContentItem } from '@erudit-js/core/content/page';

import type { ContentNavNode } from '../nav/types';
import { logContentError } from './utils/contentError';
import { insertContentItem } from './utils/insertContentItem';
import { insertContentResolved } from './utils/insertContentResolved';

export async function resolvePage(pageNode: ContentNavNode) {
  ERUDIT.log.debug.start(
    `Resolving page ${ERUDIT.log.stress(pageNode.fullId)}...`,
  );

  try {
    const pageModule = await ERUDIT.import<{
      content: Document;
      page: PageContentItem;
    }>(ERUDIT.paths.project(`content/${pageNode.contentRelPath}/page`));

    if (!isContentItem<PageContentItem>(pageModule?.page, 'page')) {
      throw new Error('Page `page` export must be a page content item!');
    }

    if (!isDocument(pageModule?.content)) {
      throw new Error('Page `content` export must be a Document!');
    }

    await insertContentItem(pageNode, pageModule.page);

    const proseDocument = pageModule.content;
    const result = await ERUDIT.repository.prose.fromRaw({
      rawProse: proseDocument.rawProse,
    });

    if (result.toc?.length) {
      await ERUDIT.db.insert(ERUDIT.db.schema.contentToc).values({
        fullId: pageNode.fullId,
        toc: result.toc,
      });
    }

    await ERUDIT.repository.content.updateSchemaCounts(
      pageNode.fullId,
      result.schemaCounts,
    );

    await ERUDIT.db.insert(ERUDIT.db.schema.pages).values({
      fullId: pageNode.fullId,
      prose: result.prose,
    });

    await insertContentResolved(pageNode.fullId, 'page', result);
  } catch (error) {
    logContentError(pageNode);
    throw error;
  }
}
