export interface EruditSponsors {
    addLink: string;
    tier1Label: string;
    tier2Label: string;
    defaultCameoMessages: string[];
}

export type SponsorTier = 'tier1' | 'tier2';

interface BaseSponsor {
    tier: SponsorTier;
    sponsorId: string;
    name: string;
    icon?: string;
    avatar?: string;
    slogan?: string;
    color?: string;
    link?: string;
}

export interface Tier1Sponsor extends BaseSponsor {
    tier: 'tier1';
}

export interface Tier2Sponsor extends BaseSponsor {
    tier: 'tier2';
    messages?: string[];
}

export type Sponsor = Tier1Sponsor | Tier2Sponsor;

export type SponsorConfig<T extends Sponsor> = Omit<T, 'sponsorId' | 'avatar'>;
