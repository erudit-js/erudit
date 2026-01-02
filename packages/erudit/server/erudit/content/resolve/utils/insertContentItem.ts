import { globSync } from 'glob';
import type { ContentItem } from '@erudit-js/core/content/item';
import {
    getGlobalContentPath,
    type GlobalContentItem,
} from '@erudit-js/core/content/global';

import type { ContentNavNode } from '../../nav/types';

export async function insertContentItem(
    navNode: ContentNavNode,
    contentItem: ContentItem,
) {
    await resolveContributions(navNode.fullId, contentItem);

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

async function resolveContributions(fullId: string, contentItem: ContentItem) {
    if (contentItem.contributions) {
        const seenContributors = new Set<string>();

        for (const contribution of contentItem.contributions as any) {
            const contributorId: string =
                typeof contribution === 'string'
                    ? contribution
                    : contribution.contributor;

            const description: string | undefined =
                typeof contribution === 'string'
                    ? undefined
                    : contribution.description;

            if (seenContributors.has(contributorId)) {
                ERUDIT.log.warn(
                    `Duplicate contributor "${contributorId}" in content item "${fullId}"!`,
                );
                continue;
            }

            seenContributors.add(contributorId);

            await ERUDIT.db
                .insert(ERUDIT.db.schema.contentContributions)
                .values({
                    contentFullId: fullId,
                    contributorId,
                    description,
                });
        }
    }
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
