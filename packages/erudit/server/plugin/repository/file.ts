import { ERUDIT_SERVER } from '@server/global';
import { DbFile } from '@server/db/entities/File';

export async function getFileFullPath(path: string) {
    const dbFile = await ERUDIT_SERVER.DB.manager.findOne(DbFile, {
        where: { path },
    });

    return dbFile?.fullPath;
}
