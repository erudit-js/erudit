import type { GroupConfig } from '@erudit-js/cog/schema';

import { DbGroup } from '@server/db/entities/Group';
import { ERUDIT_SERVER } from '@erudit/server/plugin/global';
import type { BuilderFunctionArgs } from '../builderArgs';

export async function buildGroup({
    navNode,
    config,
}: BuilderFunctionArgs<GroupConfig>) {
    const dbGroup = new DbGroup();
    dbGroup.contentId = navNode.fullId;
    dbGroup.type = config?.type || 'folder';

    await ERUDIT_SERVER.DB.manager.save(dbGroup);
}
