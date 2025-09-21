import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { TopicPart } from '@erudit-js/cog/schema';

export const snippets = sqliteTable('snippets', {
    snippedId: integer().primaryKey({ autoIncrement: true }),
    contentFullId: text().notNull(),
    topicPart: text().$type<TopicPart>(),
    domId: text().notNull(),
    search: integer({ mode: 'boolean' }).notNull(),
    quick: integer({ mode: 'boolean' }).notNull(),
    elementName: text().notNull(),
    title: text().notNull(),
    description: text(),
    synonyms: text({ mode: 'json' }).$type<string[]>(),
});
