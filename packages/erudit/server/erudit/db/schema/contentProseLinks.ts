import { sqliteTable, primaryKey, text } from 'drizzle-orm/sqlite-core';
import { type ProseLink } from '@erudit-js/core/prose/link';
import { type ContentProseType } from '@erudit-js/core/content/prose';

export const contentProseLinks = sqliteTable(
  'contentProseLinks',
  {
    fromContentId: text().notNull(),
    fromContentProseType: text().notNull().$type<ContentProseType>(),
    proseLink: text({ mode: 'json' }).notNull().$type<ProseLink>(),
    toContentId: text(),
    toContentProseType: text().$type<ContentProseType>(),
  },
  (table) => [
    primaryKey({
      columns: [
        table.fromContentId,
        table.fromContentProseType,
        table.proseLink,
      ],
    }),
  ],
);
