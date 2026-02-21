import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';

export const news = sqliteTable('news', {
  date: text().primaryKey(),
  prose: text({ mode: 'json' }).$type<ProseElement>().notNull(),
});
