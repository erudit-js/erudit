export interface EruditSponsors {
    addLink: string;
    tier1Label: string;
    tier2Label: string;
    defaultCameoMessages?: string[];
    defaultSponsorMessages?: string[];
}

interface BaseSponsor {
    tier: 1 | 2;
    name: string;
    icon?: string;
    avatar?: string;
    info?: string;
    color?: string;
    link?: string;
}

export interface SponsorTier1 extends BaseSponsor {
    tier: 1;
}

export interface SponsorTier2 extends BaseSponsor {
    tier: 2;
    messages?: string[];
}

export type Sponsor = SponsorTier1 | SponsorTier2;

export function defineSponsor(sponsor: Sponsor) {
    return sponsor;
}
