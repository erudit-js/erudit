import { readFileSync } from 'node:fs';
import type { GroupConfig } from 'erudit-cog/schema';

import { DbGroup } from '@server/db/entities/Group';
import { ERUDIT_SERVER } from '@erudit/server/plugin/global';
import type { BuilderFunctionArgs } from '../builderArgs';
import { contentItemPath } from '../path';
import { parseBitranContent } from '../parse';

export async function buildGroup({
    navNode,
    config,
}: BuilderFunctionArgs<GroupConfig>) {
    const dbGroup = new DbGroup();
    dbGroup.contentId = navNode.id;
    dbGroup.type = config?.type || 'folder';

    try {
        const strContent = readFileSync(
            contentItemPath(navNode, 'content.bi'),
            'utf-8',
        );

        if (strContent) {
            dbGroup.content = strContent;
            await parseBitranContent(
                {
                    type: 'group',
                    path: navNode.id,
                },
                strContent,
            );
        }
    } catch {}

    await ERUDIT_SERVER.DB.manager.save(dbGroup);
}
