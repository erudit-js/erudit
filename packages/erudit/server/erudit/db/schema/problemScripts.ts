import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const problemScripts = sqliteTable(
    'problemScripts',
    {
        problemScriptId: text(),
        contentFullId: text(),
    },
    (table) => [
        primaryKey({
            columns: [table.problemScriptId, table.contentFullId],
        }),
    ],
);
