import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';

export const topics = sqliteTable('topics', {
  fullId: text().primaryKey(),
  article: text({ mode: 'json' }).$type<ProseElement>(),
  summary: text({ mode: 'json' }).$type<ProseElement>(),
  practice: text({ mode: 'json' }).$type<ProseElement>(),
});
