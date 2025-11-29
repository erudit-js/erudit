import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AnySchema, ProseElement } from '@jsprose/core';
import type { ContentType } from '@erudit-js/core/content/type';
import type { TopicPart } from '@erudit-js/core/content/topic';

export const uniques = sqliteTable(
    'uniques',
    {
        contentFullId: text().notNull(),
        uniqueSlug: text().notNull(),
        typeOrPart: text().notNull().$type<ContentType | TopicPart>(),
        domId: text().notNull(),
        parsedElement: text({ mode: 'json' })
            .$type<ProseElement<AnySchema>>()
            .notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.contentFullId, table.uniqueSlug, table.typeOrPart],
        }),
    ],
);
