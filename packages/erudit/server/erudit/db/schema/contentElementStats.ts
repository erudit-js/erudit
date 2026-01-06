import {
    integer,
    sqliteTable,
    text,
    primaryKey,
} from 'drizzle-orm/sqlite-core';

export const contentElementStats = sqliteTable(
    'contentElementStats',
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
