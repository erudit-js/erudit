import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';

import { jsonProse } from '../jsonProse';

export const pages = sqliteTable('pages', {
  fullId: text().primaryKey(),
  prose: jsonProse().$type<ProseElement>().notNull(),
});
