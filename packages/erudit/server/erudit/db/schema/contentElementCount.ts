import {
    integer,
    sqliteTable,
    text,
    primaryKey,
} from 'drizzle-orm/sqlite-core';

export const contentElementCount = sqliteTable(
    'contentElementCount',
    {
        fullId: text().notNull(),
        schemaName: text().notNull(),
        count: integer().notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.fullId, table.schemaName],
        }),
    ],
);
