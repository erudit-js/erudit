import type { ContentConfig } from '@erudit-js/cog/schema';
import type { ContentNavNode } from '../../nav/types';

export async function insertContentConfig(
    navNode: ContentNavNode,
    baseConfig: ContentConfig | undefined,
) {
    baseConfig = baseConfig || {};

    await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
        fullId: navNode.fullId,
        type: navNode.type,
        title: baseConfig.title || navNode.fullId.split('/').pop()!,
        navTitle: baseConfig.navTitle,
        description: baseConfig.description,
        hidden: Boolean(baseConfig.hidden) || false,
        flags: baseConfig.flags,
    });
}
