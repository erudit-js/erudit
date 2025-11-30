import {
    integer,
    primaryKey,
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';
import type { ContentProseType } from '@erudit-js/core/content/prose';

export const contentSnippets = sqliteTable(
    'contentSnippets',
    {
        contentFullId: text().notNull(),
        contentProseType: text().notNull().$type<ContentProseType>(),
        elementId: text().notNull(),
        schemaName: text().notNull(),
        search: integer({ mode: 'boolean' }).notNull(),
        quick: integer({ mode: 'boolean' }).notNull(),
        title: text().notNull(),
        description: text(),
        synonyms: text({ mode: 'json' }).$type<string[]>(),
    },
    (table) => [
        primaryKey({
            columns: [
                table.contentFullId,
                table.contentProseType,
                table.elementId,
            ],
        }),
    ],
);
