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
    // Comma-separated unique names that were specifically targeted via <Dep>.
    // Only set for auto deps; null means the dep targets the whole page.
    uniqueNames: text(),
  },
  (table) => [
    primaryKey({
      columns: [table.fromFullId, table.toFullId],
    }),
  ],
);
