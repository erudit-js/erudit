import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AnySchema, ProseElement } from '@jsprose/core';

export const pages = sqliteTable('pages', {
    fullId: text().primaryKey(),
    blocks: text({ mode: 'json' }).$type<ProseElement<AnySchema>>().notNull(),
});
