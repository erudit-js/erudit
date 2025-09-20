import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ParsedElement } from '@erudit-js/prose';
import { BlocksSchema } from '@erudit-js/prose/default/blocks';

export const pages = sqliteTable('pages', {
    fullId: text().primaryKey(),
    parsedTree: text({ mode: 'json' })
        .$type<ParsedElement<BlocksSchema>>()
        .notNull(),
});
