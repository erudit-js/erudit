import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ParsedElement } from '@erudit-js/prose';
import { BlocksSchema } from '@erudit-js/prose/default/blocks';

export const topics = sqliteTable('topics', {
    fullId: text().primaryKey(),
    article: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
    summary: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
    practice: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
});
