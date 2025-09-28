import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { ContentFlags, ContentType } from '@erudit-js/cog/schema';

export const content = sqliteTable('content', {
    fullId: text().primaryKey(),
    type: text().$type<ContentType>().notNull(),
    title: text().notNull(),
    navTitle: text(),
    description: text(),
    hidden: integer({ mode: 'boolean' }).notNull(),
    flags: text({ mode: 'json' }).$type<ContentFlags>(),
});
