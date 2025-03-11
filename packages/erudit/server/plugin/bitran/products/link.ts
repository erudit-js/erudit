import { isTopicPart } from '@erudit-js/cog/schema';

import { DbUnique } from '@server/db/entities/Unique';
import { ERUDIT_SERVER } from '@server/global';
import { DbContent } from '@server/db/entities/Content';
import { DbContributor } from '@server/db/entities/Contributor';

import {
    createLinkTarget,
    type LinkTarget,
} from '@erudit/shared/bitran/link/target';
import {
    toAbsoluteContentId,
    toAbsoluteContentLocation,
} from '@server/content/absoluteId';
import type { BitranContext } from '@erudit/shared/bitran/context';
import {
    parseBitranLocation,
    stringifyBitranLocation,
} from '@erudit/shared/bitran/location';
import {
    createBitranLocationLink,
    createContentLink,
    createContributorLink,
    createTopicPartLink,
} from '@erudit/shared/link';
import type { LinkParseData } from '@erudit/shared/bitran/link/shared';

export async function resolveLinkTarget(
    linkData: LinkParseData,
    context: BitranContext,
): Promise<LinkTarget> {
    const linkTarget = createLinkTarget(linkData.target, context);

    if (linkTarget.type === 'unique') {
        const absoluteLocation = toAbsoluteContentLocation(
            linkTarget.strlocation,
            context.location?.path!,
        );

        const dbUnique = await ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
            select: ['location', 'productName'],
            where: { location: absoluteLocation },
        });

        if (!dbUnique)
            throw new Error(
                `Unique "${linkTarget.strlocation}" does not exist!`,
            );

        const targetLocation = parseBitranLocation(dbUnique.location);

        linkTarget._productName = dbUnique.productName;
        linkTarget._href = createBitranLocationLink(targetLocation);
        linkTarget._absoluteStrLocation =
            stringifyBitranLocation(targetLocation);
    } else if (linkTarget.type === 'page') {
        const absoluteContentId = toAbsoluteContentId(
            linkTarget.path!,
            context.location?.path,
        );

        switch (linkTarget.pageType) {
            case 'article':
            case 'summary':
            case 'practice':
            case 'group':
            case 'book':
                {
                    const dbContent = await ERUDIT_SERVER.DB.manager.findOne(
                        DbContent,
                        {
                            where: { contentId: absoluteContentId },
                        },
                    );

                    if (!dbContent)
                        throw new Error(
                            `Page "${linkTarget.pageType}|${absoluteContentId}" does not exist!`,
                        );

                    linkTarget._href = isTopicPart(linkTarget.pageType)
                        ? createTopicPartLink(
                              linkTarget.pageType,
                              absoluteContentId,
                          )
                        : createContentLink(
                              linkTarget.pageType,
                              absoluteContentId,
                          );
                }
                break;

            case 'contributor':
                {
                    const dbContributor =
                        await ERUDIT_SERVER.DB.manager.findOne(DbContributor, {
                            select: ['contributorId'],
                            where: { contributorId: absoluteContentId },
                        });

                    if (!dbContributor)
                        throw new Error(
                            `Contributor "${absoluteContentId}" does not exist!`,
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
