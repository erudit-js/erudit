import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AnySchema, ProseElement } from '@jsprose/core';

export const news = sqliteTable('news', {
  date: text().primaryKey(),
  prose: text({ mode: 'json' }).$type<ProseElement<AnySchema>>().notNull(),
});
