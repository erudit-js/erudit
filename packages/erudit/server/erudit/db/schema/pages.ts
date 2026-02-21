import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';

export const pages = sqliteTable('pages', {
  fullId: text().primaryKey(),
  prose: text({ mode: 'json' }).$type<ProseElement>().notNull(),
});
