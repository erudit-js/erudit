import { DbContributor } from '@server/db/entities/Contributor';
import { ERUDIT_SERVER } from '@server/global';

export async function contributorExists(contributorId: string) {
    return await ERUDIT_SERVER.DB.manager.exists(DbContributor, {
        where: { contributorId },
    });
}
