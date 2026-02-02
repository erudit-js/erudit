import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const problemScripts = sqliteTable(
  'problemScripts',
  {
    problemScriptSrc: text(),
    contentFullId: text(),
  },
  (table) => [
    primaryKey({
      columns: [table.problemScriptSrc, table.contentFullId],
    }),
  ],
);
