import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';

import { jsonProse } from '../jsonProse';

export const news = sqliteTable('news', {
  date: text().primaryKey(),
  prose: jsonProse().$type<ProseElement>().notNull(),
});
