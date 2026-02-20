import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ProseElement } from 'tsprose';
import type { ContentProseType } from '@erudit-js/core/content/prose';

import { jsonProse } from '../jsonProse';

export const contentUniques = sqliteTable(
  'contentUniques',
  {
    contentFullId: text().notNull(),
    contentProseType: text().notNull().$type<ContentProseType>(),
    uniqueName: text().notNull(),
    title: text(),
    prose: jsonProse().$type<ProseElement>().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.contentFullId, table.uniqueName, table.contentProseType],
    }),
  ],
);
