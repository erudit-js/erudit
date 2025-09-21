import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ElementSchemaAny, ParsedElement } from '@erudit-js/prose';
import { TopicPart } from '@erudit-js/cog/schema';

export const uniques = sqliteTable('uniques', {
    uniqueId: text().primaryKey(),
    domId: text().notNull(),
    contentFullId: text().notNull(),
    topicPart: text().$type<TopicPart>(),
    parsedElement: text({ mode: 'json' })
        .$type<ParsedElement<ElementSchemaAny>>()
        .notNull(),
});
