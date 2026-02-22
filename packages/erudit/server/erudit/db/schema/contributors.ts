import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';

export const contributors = sqliteTable('contributors', {
  contributorId: text().primaryKey(),
  displayName: text(),
  short: text(),
  avatarExtension: text(),
  editor: integer({ mode: 'boolean' }),
  links: text({ mode: 'json' }).$type<Record<string, string>>(),
  description: text({ mode: 'json' }).$type<ProseElement>(),
});
