import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const files = sqliteTable('files', {
    path: text().primaryKey(),
});
