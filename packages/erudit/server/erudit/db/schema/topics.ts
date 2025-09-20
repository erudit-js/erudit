import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ParsedElement } from '@erudit-js/prose';
import { BlocksSchema } from '@erudit-js/prose/default/blocks';

export const topics = sqliteTable('topics', {
    fullId: text().primaryKey(),
    parsedArticle: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
    parsedSummary: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
    parsedPractice: text({ mode: 'json' }).$type<ParsedElement<BlocksSchema>>(),
});
