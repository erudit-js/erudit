import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Sponsor } from '@erudit-js/core/sponsor';

export const sponsors = sqliteTable('sponsors', {
    sponsorId: text().primaryKey(),
    hasMessages: integer({ mode: 'boolean' }).notNull(),
    hasAvatar: integer({ mode: 'boolean' }).notNull(),
    data: text({ mode: 'json' }).notNull().$type<Sponsor>(),
});
