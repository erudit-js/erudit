import type {
    SponsorConfig,
    Tier1Sponsor,
    Tier2Sponsor,
} from '@erudit-js/cog/schema';

export function defineTier1Sponsor(
    sponsorConfig: SponsorConfig<Tier1Sponsor>,
): SponsorConfig<Tier1Sponsor> {
    return sponsorConfig;
}

export function defineTier2Sponsor(
    sponsorConfig: SponsorConfig<Tier2Sponsor>,
): SponsorConfig<Tier2Sponsor> {
    return sponsorConfig;
}
