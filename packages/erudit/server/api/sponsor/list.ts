import type { Tier1Sponsor, Tier2Sponsor } from '@erudit-js/cog/schema';

import { getSponsorIds, retrieveSponsor } from '@server/sponsor/repository';

const BATCH_SIZE = 10;

export default defineEventHandler(async () => {
    const sponsorIds = getSponsorIds();
    const sponsors = await processSponsorsBatched(sponsorIds);
    return categorizeSponsorsByTier(sponsors);
});

async function processSponsorsBatched(sponsorIds: string[]) {
    const allSponsors = [];

    for (let i = 0; i < sponsorIds.length; i += BATCH_SIZE) {
        const batch = sponsorIds.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map((sponsorId) => retrieveSponsor(sponsorId!)),
        );
        allSponsors.push(...batchResults);
    }

    return allSponsors;
}

function categorizeSponsorsByTier(sponsors: (Tier1Sponsor | Tier2Sponsor)[]) {
    return {
        tier1: sponsors.filter(
            (sponsor): sponsor is Tier1Sponsor => sponsor.tier === 'tier1',
        ),
        tier2: sponsors.filter(
            (sponsor): sponsor is Tier2Sponsor => sponsor.tier === 'tier2',
        ),
    };
}
