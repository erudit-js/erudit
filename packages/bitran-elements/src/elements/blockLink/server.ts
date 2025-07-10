import {
    isBitranLocationType,
    isContentType,
    isTopicPart,
    parseBitranLocation,
    parsePartialBitranLocation,
    stringifyBitranLocation,
    type BitranContext,
    type BitranLocationType,
} from '@erudit-js/cog/schema';

import {
    createContributorLink,
    createTopicPartLink,
} from '@erudit/shared/link';
import { resolveClientContentId } from '@server/repository/contentId';
import { ERUDIT_SERVER } from '@server/global';
import { DbContent } from '@server/db/entities/Content';
import { createContentLink } from '@server/repository/link';
import { DbContributor } from '@server/db/entities/Contributor';
import { DbUnique } from '@server/db/entities/Unique';

import {
    BlockLinkNode,
    blockLinkRenderDataGenerator,
    type BlockLinkParseData,
    type BlockLinkRenderData,
} from './shared';
import { defineElementTranspiler } from '@bitran-js/transpiler';
import { BlockLinkParser, BlockLinkStringifier } from './factory';

async function createLinkForLocation(
    locationType: BitranLocationType,
    path: string,
    uniqueId?: string,
): Promise<string> {
    if (isTopicPart(locationType)) {
        return (
            createTopicPartLink(locationType, path) +
            (uniqueId ? '#' + uniqueId : '')
        );
    }

    if (isContentType(locationType)) {
        return (await createContentLink(path)) + '#' + uniqueId;
    }

    if (locationType === 'contributor') {
        return createContributorLink(path);
    }

    return '';
}

async function getContentTitle(contentId: string): Promise<string | null> {
    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(DbContent, {
        select: ['title', 'contentId'],
        where: { contentId },
    });
    return dbContent ? dbContent.title || dbContent.contentId : null;
}

async function getContributorTitle(
    contributorId: string,
): Promise<string | null> {
    const dbContributor = await ERUDIT_SERVER.DB.manager.findOne(
        DbContributor,
        {
            select: ['displayName', 'contributorId'],
            where: { contributorId },
        },
    );
    return dbContributor
        ? dbContributor.displayName || dbContributor.contributorId
        : null;
}

async function getLocationTitle(
    locationType: BitranLocationType,
    path: string,
    contextPath?: string,
): Promise<string> {
    if (isContentType(locationType) || isTopicPart(locationType)) {
        const resolvedPath = contextPath
            ? resolveClientContentId(path, contextPath, 'full')
            : path;
        return (await getContentTitle(resolvedPath)) || '';
    }

    if (locationType === 'contributor') {
        return (await getContributorTitle(path)) || '';
    }

    return '';
}

async function createBlockLinkRenderData(
    blockLinkParseData: BlockLinkParseData,
    context: BitranContext,
): Promise<BlockLinkRenderData> {
    const inputLocation = blockLinkParseData.location;

    if (inputLocation.startsWith('page|')) {
        const locationType = inputLocation.split('|')[1]!;
        let path = inputLocation.split('|')[2]!;

        if (!isBitranLocationType(locationType)) {
            throw new Error(`Invalid location type: ${locationType}!`);
        }

        if (isContentType(locationType) || isTopicPart(locationType)) {
            path = resolveClientContentId(path, context.location.path!, 'full');

            const dbContent = await ERUDIT_SERVER.DB.manager.findOne(
                DbContent,
                {
                    select: ['contentId', 'title', 'description'],
                    where: { contentId: path },
                },
            );

            if (!dbContent) {
                throw new Error(
                    `Page "${locationType}|${path}" does not exist!`,
                );
            }

            return {
                type: 'location',
                locationType,
                link: await createLinkForLocation(
                    locationType,
                    dbContent.contentId,
                ),
                title: dbContent.title || dbContent.contentId,
                locationDescription: dbContent.description,
            };
        }

        switch (locationType) {
            case 'contributor':
                const title = await getContributorTitle(path);
                if (!title) {
                    throw new Error(`Contributor "${path}" does not exist!`);
                }

                return {
                    type: 'location',
                    locationType,
                    link: await createLinkForLocation(locationType, path),
                    title,
                    locationDescription: undefined,
                };
        }
    }

    // Unique mode
    const location = parsePartialBitranLocation(
        inputLocation,
        context.location,
    );

    if (isContentType(location.type) || isTopicPart(location.type)) {
        location.path = resolveClientContentId(
            location.path!,
            context.location.path!,
            'full',
        );
    }

    const dbUnique = await ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
        select: ['productName', 'title', 'context'],
        where: { location: stringifyBitranLocation(location) },
    });

    if (!dbUnique) {
        throw new Error(`Unique location "${inputLocation}" does not exist!`);
    }

    const link = await createLinkForLocation(
        location.type,
        location.path!,
        location.unique,
    );

    let locationTitle = '';

    if (dbUnique.context) {
        const contextLocation = dbUnique.context.location;

        if (isContentType(contextLocation.type)) {
            const dbContent = await ERUDIT_SERVER.DB.manager.findOne(
                DbContent,
                {
                    select: ['title'],
                    where: { contentId: contextLocation.path! },
                },
            );

            locationTitle = dbContent?.title || contextLocation.path!;
        }
    }

    return {
        type: 'unique',
        locationType: location.type,
        elementName: dbUnique.productName,
        link,
        title: dbUnique.title || dbUnique.productName,
        locationTitle,
        locationDescription: undefined,
    };
}

export const blockLinkServerTranspiler = defineElementTranspiler({
    Node: BlockLinkNode,
    Parsers: [BlockLinkParser],
    Stringifier: BlockLinkStringifier,
    renderDataGenerator: {
        ...blockLinkRenderDataGenerator,
        async createValue({ node, extra: runtime }) {
            if (!runtime) {
                throw new Error(
                    'Missing runtime when prerendering block link data! The runtime is necessary to resolve block link data!',
                );
            }

            return await createBlockLinkRenderData(
                node.parseData,
                runtime.context,
            );
        },
    },
});
