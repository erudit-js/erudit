import { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { Database } from 'better-sqlite3';

import type * as schema from './schema';

export type EruditServerDatabase = LibSQLDatabase<typeof schema> & {
    path: string;
    connection: Database;
    schema: typeof schema;
};
