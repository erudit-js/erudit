import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ResolvedTocItem } from '@erudit-js/prose';

export const contentToc = sqliteTable(
    'contentToc',
    {
        fullId: text().notNull(),
        topicPart: text(),
        toc: text({ mode: 'json' }).notNull().$type<ResolvedTocItem[]>(),
    },
    (table) => [
        primaryKey({
            columns: [table.fullId, table.topicPart],
        }),
    ],
);
