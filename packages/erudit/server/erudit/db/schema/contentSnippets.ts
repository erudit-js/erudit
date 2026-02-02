import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import type { SnippetData } from '@erudit-js/prose';

export const contentSnippets = sqliteTable('contentSnippets', {
  snippetId: integer().primaryKey({ autoIncrement: true }),
  contentFullId: text().notNull(),
  contentProseType: text().notNull().$type<ContentProseType>(),
  schemaName: text().notNull(),
  elementId: text().notNull(),
  snippetData: text({ mode: 'json' }).$type<SnippetData>().notNull(),
  search: integer({ mode: 'boolean' }).notNull(),
  quick: integer({ mode: 'boolean' }).notNull(),
  seo: integer({ mode: 'boolean' }).notNull(),
});
