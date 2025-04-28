import type { ContentType } from '@erudit-js/cog/schema';
import { Like } from 'typeorm';

import { ERUDIT_SERVER } from '@server/global';
import { DbContent } from '@server/db/entities/Content';
import { DbContribution } from '@server/db/entities/Contribution';
import { getContentContext } from '@server/content/context';
import { DbContributor } from '@server/db/entities/Contributor';
import { getIdsUp, getNavBookIds, getPreviousNextNav } from '@server/nav/utils';
import { getTopicPart } from './topic';
import type { NavNode } from '../nav/node';

import { createContentLink, createTopicPartLink } from '@erudit/shared/link';
import type { PreviousNextItem } from '@erudit/shared/content/previousNext';
import type { ContentContributor } from '@erudit/shared/contributor';
import type { ContentGenericData } from '@shared/content/data/base';
import { toAbsoluteContentId } from '@erudit/shared/bitran/contentId';

export async function getContentGenericData(
    contentId: string,
): Promise<ContentGenericData> {
    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        where: { contentId },
    });

    if (!dbContent) {
        throw createError({
            statusCode: 404,
            message: `Content item "${contentId}" not found!`,
        });
    }

    const previousNext = await getPreviousNext(contentId);
    const decoration = await getContentDecoration(contentId);
    const flags = await getContentFlags(contentId);

    const contentPage: ContentGenericData = {
        contentId,
        type: dbContent.type,
        title: dbContent.title || undefined,
        description: dbContent.description || undefined,
        flags,
        previousNext,
        decoration,
        context: await getContentContext(contentId),
        seo: dbContent.seo,
        ogImage: dbContent.ogImage,
        dependencies: dbContent.dependencies
            ? await getContentDependencies(contentId, dbContent.dependencies)
            : undefined,
        references: dbContent.references,
    };

    return contentPage;
}

export async function getPreviousNext(contentId: string) {
    const { previousNav, nextNav } = await getPreviousNextNav(contentId);

    async function getItemData(navNode: NavNode): Promise<PreviousNextItem> {
        const title = await getContentTitle(navNode.fullId);

        const link = await (async () => {
            if (navNode.type === 'topic')
                return createTopicPartLink(
                    await getTopicPart(navNode.fullId),
                    navNode.id,
                );

            return createContentLink(navNode.type, navNode.id);
        })();

        return {
            title,
            link,
        };
    }

    return {
        previous: previousNav ? await getItemData(previousNav) : undefined,
        next: nextNav ? await getItemData(nextNav) : undefined,
    };
}

export async function getContentDecoration(contentId: string) {
    const idsUp = await getIdsUp(contentId);

    for (const id of idsUp) {
        const decoration = (
            await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
                select: ['decoration'],
                where: { contentId: id },
            })
        )?.decoration;

        if (decoration) return decoration;
    }

    return undefined;
}

export async function getContentFlags(contentId: string) {
    const idsUp = await getIdsUp(contentId);
    const flags: any = {};

    for (const id of idsUp.reverse()) {
        const dbFlags = (
            await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
                select: ['flags'],
                where: { contentId: id },
            })
        )?.flags;

        if (dbFlags)
            for (const [flagName, flagValue] of Object.entries(dbFlags))
                flags[flagName] = flagValue;
    }

    for (const [flagName, flagValue] of Object.entries(flags))
        if (flagValue === false) delete flags[flagName];

    return flags;
}

export async function getContentDependencies(
    contentId: string,
    strDependencies: string[],
) {
    const dependencyIds = strDependencies.map((rawDependency) =>
        toAbsoluteContentId(rawDependency, contentId, getNavBookIds()),
    );
    const dependencies: Record<string, string> = {};

    for (const dependencyId of dependencyIds)
        dependencies[await getContentLink(dependencyId)] =
            await getContentTitle(dependencyId);

    return dependencies;
}

export async function getContentTitle(contentId: string) {
    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['title'],
        where: { contentId },
    });

    return dbContent?.title || contentId.split('/').pop()!;
}

export async function getContentLink(contentId: string) {
    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['type'],
        where: { contentId },
    });

    if (!dbContent)
        throw createError({
            statusCode: 404,
            statusText: `Missing "${contentId}" content item!`,
        });

    if (dbContent.type !== 'topic')
        return createContentLink(dbContent.type, contentId);

    const topicPart = await getTopicPart(contentId);

    return createTopicPartLink(topicPart, contentId);
}

export async function getContentContributors(contentId: string) {
    const contributorIds = await (async () => {
        const idHash: Record<string, true> = {};

        (
            await ERUDIT_SERVER.DB.manager.find(DbContribution, {
                select: ['contributorId'],
                where: { contentId },
            })
        ).forEach(
            (contribution) => (idHash[contribution.contributorId] = true),
        );

        const type: ContentType = (await ERUDIT_SERVER.DB.manager.findOne(
            DbContent,
            {
                select: ['type'],
                where: { contentId },
            },
        ))!.type;

        if (type === 'book' || type === 'group') {
            // Collecting contributors for all sub-content items
            (
                await ERUDIT_SERVER.DB.manager.find(DbContribution, {
                    select: ['contributorId'],
                    where: { contentId: Like(`${contentId}/%`) },
                })
            ).forEach(
                (contribution) => (idHash[contribution.contributorId] = true),
            );
        }

        return Object.keys(idHash);
    })();

    const contentContributors: ContentContributor[] = [];

    for (const contributorId of contributorIds) {
        const dbContributor = (await ERUDIT_SERVER.DB.manager.findOne(
            DbContributor,
            {
                select: ['contributorId', 'displayName', 'avatar'],
                where: { contributorId },
            },
        ))!;

        const contentContributor: ContentContributor = { contributorId };

        if (dbContributor.displayName)
            contentContributor.displayName = dbContributor.displayName;

        if (dbContributor.avatar)
            contentContributor.avatar = dbContributor.avatar;

        contentContributors.push(contentContributor);
    }

    return contentContributors.length ? contentContributors : undefined;
}
