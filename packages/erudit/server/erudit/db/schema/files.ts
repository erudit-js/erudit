import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { primaryKey } from 'drizzle-orm/sqlite-core';

export const files = sqliteTable(
    'files',
    {
        path: text(),
        role: text(),
    },
    (table) => [primaryKey({ columns: [table.path, table.role] })],
);
