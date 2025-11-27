import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { AnySchema, ProseElement } from '@jsprose/core';

export const topics = sqliteTable('topics', {
    fullId: text().primaryKey(),
    article: text({ mode: 'json' }).$type<ProseElement<AnySchema>>(),
    summary: text({ mode: 'json' }).$type<ProseElement<AnySchema>>(),
    practice: text({ mode: 'json' }).$type<ProseElement<AnySchema>>(),
});
