import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AnySchema, ProseElement } from '@jsprose/core';
import type { ContentProseType } from '@erudit-js/core/content/prose';

export const contentUniques = sqliteTable(
    'contentUniques',
    {
        contentFullId: text().notNull(),
        contentProseType: text().notNull().$type<ContentProseType>(),
        uniqueName: text().notNull(),
        title: text(),
        prose: text({ mode: 'json' })
            .$type<ProseElement<AnySchema>>()
            .notNull(),
    },
    (table) => [
        primaryKey({
            columns: [
                table.contentFullId,
                table.uniqueName,
                table.contentProseType,
            ],
        }),
    ],
);
