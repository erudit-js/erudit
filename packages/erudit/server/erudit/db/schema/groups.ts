import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable('groups', {
  fullId: text().primaryKey(),
  separator: integer({ mode: 'boolean' }).notNull(),
});
