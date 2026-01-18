import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ContentProseType } from '@erudit-js/core/content/prose';

export const contentSnippets = sqliteTable('contentSnippets', {
    snippetId: integer().primaryKey({ autoIncrement: true }),
    contentFullId: text().notNull(),
    contentProseType: text().notNull().$type<ContentProseType>(),
    title: text().notNull(),
    description: text(),
    elementId: text().notNull(),
    schemaName: text().notNull(),
    search: integer({ mode: 'boolean' }).notNull(),
    searchSynonyms: text({ mode: 'json' }).$type<string[]>(),
    quick: integer({ mode: 'boolean' }).notNull(),
    seo: integer({ mode: 'boolean' }).notNull(),
});
