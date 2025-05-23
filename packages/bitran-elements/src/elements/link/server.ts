import { defineElementTranspiler } from '@bitran-js/transpiler';
import {
    getEruditBitranRuntime,
    isContentType,
    isTopicPart,
    parseBitranLocation,
    stringifyBitranLocation,
    type BitranContext,
} from '@erudit-js/cog/schema';

import { DbUnique } from '@server/db/entities/Unique';
import { ERUDIT_SERVER } from '@server/global';
import { DbContent } from '@server/db/entities/Content';
import { DbContributor } from '@server/db/entities/Contributor';
import {
    getFullContentId,
    getShortContentId,
    resolveClientContentId,
} from '@server/repository/contentId';

import {
    createBitranLocationLink,
    createContentLink,
    createContributorLink,
    createTopicPartLink,
} from '@erudit/shared/link';

import { LinkParser, LinkStringifier } from './factory';
import {
    type LinkParseData,
    type LinkSchema,
    LinkNode,
    linkRenderDataGenerator,
} from './shared';
import { createLinkTarget, type LinkTarget } from './target';

export class LinkServerParser extends LinkParser {
    override async parseDataFromRegexp(
        match: RegExpExecArray,
    ): Promise<{ label: string; target: string }> {
        const data = await super.parseDataFromRegexp(match);
        const { insideInclude, context } = getEruditBitranRuntime(this);

        const absolutize = (path: string) => {
            const absolutePath = resolveClientContentId(
                path,
                context.location.path!,
                'full',
            );
            return '/' + absolutePath.replace(/\\/g, '/');
        };

        if (insideInclude) {
            const linkTarget = createLinkTarget(data.target, context);

            if (linkTarget.type === 'page') {
                if (isContentType(linkTarget.pageType)) {
                    data.target = `page|${linkTarget.pageType}|${absolutize(linkTarget.path!)}`;
                }
            } else if (linkTarget.type === 'unique') {
                linkTarget.location.path = absolutize(
                    linkTarget.location.path!,
                );
                data.target = stringifyBitranLocation(linkTarget.location);
            }
        }

        return data;
    }
}

export async function resolveLinkTarget(
    linkData: LinkParseData,
    context: BitranContext,
): Promise<LinkTarget> {
    const linkTarget = createLinkTarget(linkData.target, context);

    if (linkTarget.type === 'unique') {
        if (linkTarget.location.path) {
            linkTarget.location.path = resolveClientContentId(
                linkTarget.location.path!,
                context.location.path!,
                'full',
            );
        }

        const strAbsoluteLocation = stringifyBitranLocation(
            linkTarget.location,
        );

        const dbUnique = await ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
            select: ['location', 'productName'],
            where: { location: strAbsoluteLocation },
        });

        if (!dbUnique)
            throw new Error(`Unique "${linkData.target}" does not exist!`);

        const targetLocation = parseBitranLocation(dbUnique.location);

        if (targetLocation.path) {
            targetLocation.path = getShortContentId(targetLocation.path);
        }

        linkTarget._productName = dbUnique.productName;
        linkTarget._href = createBitranLocationLink(targetLocation);
        linkTarget._absoluteStrLocation =
            stringifyBitranLocation(targetLocation);
    } else if (linkTarget.type === 'page') {
        if (isContentType(linkTarget.pageType)) {
            let absoluteContentId = resolveClientContentId(
                linkTarget.path!,
                context.location?.path!,
                'short',
            );

            absoluteContentId = await getFullContentId(absoluteContentId);

            const dbContent = await ERUDIT_SERVER.DB.manager.findOne(
                DbContent,
                {
                    where: { contentId: absoluteContentId },
                },
            );

            const shortContentId = await getShortContentId(absoluteContentId);

            if (!dbContent)
                throw new Error(
                    `Page "${linkTarget.pageType}|${absoluteContentId}" does not exist!`,
                );

            linkTarget._href = isTopicPart(linkTarget.pageType)
                ? createTopicPartLink(linkTarget.pageType, shortContentId)
                : createContentLink(linkTarget.pageType, shortContentId);

            return linkTarget;
        }

        switch (linkTarget.pageType) {
            case 'contributor':
                {
                    const contributorId = linkTarget.path!;
                    const dbContributor =
                        await ERUDIT_SERVER.DB.manager.findOne(DbContributor, {
                            select: ['contributorId'],
                            where: { contributorId },
                        });

                    if (!dbContributor)
                        throw new Error(
                            `Contributor "${contributorId}" does not exist!`,
                        );

                    linkTarget._href = createContributorLink(
                        dbContributor.contributorId,
                    );
                }
                break;
        }
    }

    return linkTarget;
}

export const linkServerTranspiler = defineElementTranspiler<LinkSchema>({
    Node: LinkNode,
    Parsers: [LinkServerParser],
    Stringifier: LinkStringifier,
    renderDataGenerator: {
        ...linkRenderDataGenerator,
        async createValue({ node, extra: runtime }) {
            if (!runtime) {
                throw new Error(
                    'Missing runtime when prerendering link data! The runtime is necessary to resolve link data!',
                );
            }

            return await resolveLinkTarget(node.parseData, runtime.context);
        },
    },
});
