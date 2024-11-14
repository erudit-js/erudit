import { DbContributor } from '@server/db/entities/Contributor';
import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler(async () => {
    return await ERUDIT_SERVER.DB.manager.count(DbContributor);
});
