import { sqliteTable, primaryKey, text } from 'drizzle-orm/sqlite-core';

export const links = sqliteTable(
    'links',
    {
        linkFrom: text(),
        linkTo: text(),
    },
    (table) => [primaryKey({ columns: [table.linkFrom, table.linkTo] })],
);
