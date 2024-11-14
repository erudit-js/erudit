import { DbBook } from '@server/db/entities/Book';
import { ERUDIT_SERVER } from '@server/global';
import type { BuilderFunctionArgs } from '../builderArgs';

export async function buildBook({ dbContent }: BuilderFunctionArgs) {
    const dbBook = new DbBook();
    dbBook.contentId = dbContent.contentId;
    await ERUDIT_SERVER.DB.manager.save(dbBook);
}
