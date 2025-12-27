import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ContentFlags } from '@erudit-js/core/content/flags';
import type { ContentType } from '@erudit-js/core/content/type';

export const content = sqliteTable('content', {
    fullId: text().primaryKey(),
    type: text().$type<ContentType>().notNull(),
    title: text().notNull(),
    navTitle: text(),
    description: text(),
    hidden: integer({ mode: 'boolean' }).notNull(),
    flags: text({ mode: 'json' }).$type<ContentFlags>(),
    decorationExtension: text(),
});
