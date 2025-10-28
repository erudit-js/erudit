import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { type ParseDataType } from '../../content/parse/parseData';

export const contentParseData = sqliteTable(
    'contentParseData',
    {
        fullId: text().notNull(),
        type: text().notNull().$type<ParseDataType>(),
        value: text().notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.fullId, table.type, table.value] }),
    ],
);
