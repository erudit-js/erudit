import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ParsedElement } from '@erudit-js/prose';
import type { BlocksSchema } from '@erudit-js/prose/default/blocks/index';

export const pages = sqliteTable('pages', {
    fullId: text().primaryKey(),
    blocks: text({ mode: 'json' })
        .$type<ParsedElement<BlocksSchema>>()
        .notNull(),
});
