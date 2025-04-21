import { ERUDIT_SERVER } from '@server/global';

export async function resetDatabase() {
    const db = ERUDIT_SERVER.DB;

    if (!db) {
        return;
    }

    await db.dropDatabase();
    await db.synchronize(true);
}
