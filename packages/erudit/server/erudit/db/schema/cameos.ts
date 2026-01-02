import {
    integer,
    primaryKey,
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';
import type { Cameo } from '@erudit-js/core/cameo';

export const cameos = sqliteTable(
    'cameos',
    {
        cameoId: text().notNull(),
        sponsor: integer({ mode: 'boolean' }).notNull(),
        data: text({ mode: 'json' }).notNull().$type<Cameo>(),
    },
    (table) => [
        primaryKey({
            columns: [table.cameoId, table.sponsor],
        }),
    ],
);
