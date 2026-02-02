import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const contentContributions = sqliteTable(
  'contentContributions',
  {
    contentFullId: text().notNull(),
    contributorId: text().notNull(),
    description: text(),
  },
  (table) => [
    primaryKey({
      columns: [table.contentFullId, table.contributorId],
    }),
  ],
);
