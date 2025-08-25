import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contributors = sqliteTable('contributors', {
    contributorId: text().primaryKey(),
    displayName: text(),
    slogan: text(),
    avatarExtension: text(),
    editor: integer({ mode: 'boolean' }),
    description: text(),
    links: text({ mode: 'json' }).$type<Record<string, string>>(),
});
