import { sqliteTable, primaryKey, text } from 'drizzle-orm/sqlite-core';
import { type ProseLink } from '@erudit-js/core/prose/link';

export const links = sqliteTable(
    'links',
    {
        fromContent: text(),
        toContent: text(),
        proseLink: text({ mode: 'json' }).$type<ProseLink>(),
    },
    (table) => [primaryKey({ columns: [table.fromContent, table.toContent] })],
);
