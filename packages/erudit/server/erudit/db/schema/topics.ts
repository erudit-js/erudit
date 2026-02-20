import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';

import { jsonProse } from '../jsonProse';

export const topics = sqliteTable('topics', {
  fullId: text().primaryKey(),
  article: jsonProse().$type<ProseElement>(),
  summary: jsonProse().$type<ProseElement>(),
  practice: jsonProse().$type<ProseElement>(),
});
