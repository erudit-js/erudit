import type {
    ResolvedSponsor,
    SponsorTier1,
    SponsorTier2,
} from '@erudit-js/core/sponsor';

export const SPONSORS = {
    tier1: {} as Record<string, ResolvedSponsor<SponsorTier1>>,
    tier2: {} as Record<string, ResolvedSponsor<SponsorTier2>>,
};
