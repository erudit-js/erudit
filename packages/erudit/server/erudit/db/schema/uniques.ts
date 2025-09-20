import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ElementSchemaAny, ParsedElement } from '@erudit-js/prose';

export const uniques = sqliteTable('uniques', {
    uniqueId: text().primaryKey(),
    domId: text().notNull(),
    contentFullId: text().notNull(),
    parsedElement: text({ mode: 'json' })
        .$type<ParsedElement<ElementSchemaAny>>()
        .notNull(),
});
