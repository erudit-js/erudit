import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Cameo } from '@erudit-js/core/cameo';

export const cameos = sqliteTable('cameos', {
    cameoId: text().primaryKey(),
    data: text({ mode: 'json' }).notNull().$type<Cameo>(),
});
