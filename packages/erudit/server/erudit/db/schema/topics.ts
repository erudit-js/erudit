import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { type ParsedElement } from '@erudit-js/prose';
import { type BlocksSchema } from '@erudit-js/prose/default/blocks/index';

export const topics = sqliteTable('topics', {
    fullId: text().primaryKey(),
    article: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
    summary: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
    practice: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
});
