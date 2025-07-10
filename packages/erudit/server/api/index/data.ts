import type { IndexData } from '@shared/indexData';

import { getAllElementStats } from '@server/repository/elementStats';
import { countAllTopics } from '@server/repository/topicCount';
import { getFullContentToc } from '@server/repository/contentToc';
import { ERUDIT_SERVER } from '@server/global';
import { DbContributor } from '@server/db/entities/Contributor';
import { getSponsorIds, readSponsorConfig } from '@server/sponsor/repository';

export default defineEventHandler<Promise<IndexData>>(async () => {
    return {
        elementStats: await getAllElementStats(),
        topicCount: await countAllTopics(),
        contentToc: await getFullContentToc(),
        contributors: await getIndexContributors(),
        sponsors: await getIndexSponsors(),
    };
});

async function getIndexContributors(): Promise<[string, string | undefined][]> {
    const dbContributors = await ERUDIT_SERVER.DB.manager.find(DbContributor, {
        select: ['contributorId', 'displayName', 'avatar'],
    });

    return dbContributors.map((contributor) => [
        contributor.displayName || contributor.contributorId,
        contributor.avatar ? '/contributors/' + contributor.avatar : undefined,
    ]);
}

async function getIndexSponsors(): Promise<[string, string | undefined][]> {
    const sponsorIds = getSponsorIds();
    const indexSponsors: [string, string | undefined][] = [];

    for (const sponsorId of sponsorIds) {
        const config = await readSponsorConfig(sponsorId);
        if (config) {
            indexSponsors.push([
                config.name || sponsorId,
                ERUDIT_SERVER.SPONSORS?.avatars[sponsorId],
            ]);
        }
    }

    return indexSponsors;
}
