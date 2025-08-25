import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { createRequire } from 'node:module';
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import * as schema from './schema';

export async function setupServerDatabase() {
    const buildDir = ERUDIT.config.paths.build;
    const nowTs = Date.now();
    const dbFilename = `erudit-${nowTs}.db`;
    const dbPath = join(buildDir, dbFilename);

    try {
        for (const f of readdirSync(buildDir)) {
            const m = f.match(/^erudit-(\d+)\.db$/);
            if (m && Number(m[1]) < nowTs) {
                try {
                    unlinkSync(join(buildDir, f));
                } catch {}
            }
        }
    } catch {}

    const connection = new Database(dbPath);

    const db = drizzle(connection, { schema });

    ERUDIT.db = new Proxy(db, {
        get(target, prop, receiver) {
            if (prop === 'connection') {
                return connection;
            }

            if (prop === 'schema') {
                return schema;
            }

            if (prop === 'path') {
                return dbPath;
            }

            return Reflect.get(target, prop, receiver);
        },
    }) as any;

    const require = createRequire(import.meta.url);
    const { generateSQLiteMigration, generateSQLiteDrizzleJson } =
        require('drizzle-kit/api') as typeof import('drizzle-kit/api');

    const migration = await generateSQLiteMigration(
        await generateSQLiteDrizzleJson({}),
        await generateSQLiteDrizzleJson(schema, undefined, 'camelCase'),
    );

    for (const query of migration) {
        await ERUDIT.db.run(query);
    }

    ERUDIT.log.success('Database connection setup complete!');
}
