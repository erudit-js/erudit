import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ContentType } from '@erudit-js/cog/schema';

export const content = sqliteTable('content', {
    fullId: text().primaryKey(),
    type: text().$type<ContentType>().notNull(),
    title: text().notNull(),
    navTitle: text(),
    description: text(),
});
