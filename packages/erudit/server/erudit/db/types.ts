import { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { Client } from '@libsql/client';

import type * as schema from './schema';

export type EruditServerDatabase = LibSQLDatabase<typeof schema> & {
    path: string;
    connection: Client;
    schema: typeof schema;
};
