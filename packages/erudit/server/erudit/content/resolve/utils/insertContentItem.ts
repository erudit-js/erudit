import { globSync } from 'glob';
import type { ContentItem } from '@erudit-js/core/content/item';

import type { ContentNavNode } from '../../nav/types';
import {
    getGlobalContentPath,
    type GlobalContentItem,
} from '@erudit-js/core/content/global';

export async function insertContentItem(
    navNode: ContentNavNode,
    contentItem: ContentItem,
) {
    if (contentItem.contributors) {
        const contributors = contentItem.contributors;
        const uniqueContributors = new Set(contributors);
        if (uniqueContributors.size !== contributors.length) {
            const duplicates = contributors.filter(
                (item, index) => contributors.indexOf(item) !== index,
            );
            throw new Error(
                `Duplicate contributors found: ${[...new Set(duplicates)].map((item) => `"${item}"`).join(', ')}`,
            );
        }
    }

    const decorationExtension = await resolveDecorationExtension(navNode);
    await resolveHardDependencies(navNode.fullId, contentItem);

    await ERUDIT.db.insert(ERUDIT.db.schema.content).values({
        fullId: navNode.fullId,
        type: navNode.type,
        title: contentItem.title || navNode.fullId.split('/').pop()!,
        navTitle: contentItem.navTitle,
        description: contentItem.description,
        hidden: Boolean(contentItem.hidden) || false,
        flags: contentItem.flags,
        decorationExtension,
        externals: contentItem.externals,
    });
}

async function resolveHardDependencies(
    fullId: string,
    contentItem: ContentItem,
) {
    if (contentItem.dependencies) {
        for (const dependency of contentItem.dependencies) {
            await ERUDIT.db.insert(ERUDIT.db.schema.contentDeps).values({
                fromFullId: getGlobalContentPath(
                    dependency.dependency as any as GlobalContentItem,
                ),
                toFullId: fullId,
                hard: true,
                reason: dependency.reason,
            });
        }
    }
}

async function resolveDecorationExtension(navNode: ContentNavNode) {
    const decorationExtension = globSync(
        ERUDIT.config.paths.project +
            '/content/' +
            navNode.contentRelPath +
            '/decoration.*',
        {
            posix: true,
        },
    )
        .shift()
        ?.split('.')
        ?.pop();

    if (decorationExtension) {
        await ERUDIT.repository.db.pushFile(
            ERUDIT.config.paths.project +
                '/content/' +
                navNode.contentRelPath +
                '/decoration.' +
                decorationExtension,
            'content-decoration:' + navNode.fullId,
        );
    }

    return decorationExtension;
}
