import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { ElementSchemaAny, ParsedElement } from '@erudit-js/prose';
import { ContentType, TopicPart } from '@erudit-js/cog/schema';

export const uniques = sqliteTable(
    'uniques',
    {
        contentFullId: text().notNull(),
        uniqueSlug: text().notNull(),
        typeOrPart: text().notNull().$type<ContentType | TopicPart>(),
        domId: text().notNull(),
        parsedElement: text({ mode: 'json' })
            .$type<ParsedElement<ElementSchemaAny>>()
            .notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.contentFullId, table.uniqueSlug, table.typeOrPart],
        }),
    ],
);
