import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const contentDeps = sqliteTable(
  'contentDeps',
  {
    fromFullId: text().notNull(),
    toFullId: text().notNull(),
    hard: integer({ mode: 'boolean' }).notNull(),
    reason: text(),
  },
  (table) => [
    primaryKey({
      columns: [table.fromFullId, table.toFullId],
    }),
  ],
);
