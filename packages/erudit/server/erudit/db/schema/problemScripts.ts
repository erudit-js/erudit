import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const problemScripts = sqliteTable('problemScripts', {
    problemScriptId: text().primaryKey(),
    contentFullId: text().notNull(),
});
