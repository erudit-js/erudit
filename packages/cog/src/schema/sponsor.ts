export interface EruditSponsors {
    addLink: string;
    tier1Label: string;
    tier2Label: string;
    defaultCameoMessages?: string[];
}

export type SponsorTier = 'tier1' | 'tier2';

interface BaseSponsor {
    tier: SponsorTier;
    name: string;
    icon?: string;
    avatar?: string;
    slogan?: string;
    color?: string;
    link?: string;
}

export interface SponsorTier1 extends BaseSponsor {
    tier: 'tier1';
}

export interface SponsorTier2 extends BaseSponsor {
    tier: 'tier2';
    quotes?: string[];
}

export type Sponsor = SponsorTier1 | SponsorTier2;

export interface ResolvedSponsorData {
    sponsorId: string;
    avatarExtension?: string;
}

export type ResolvedSponsor<T extends SponsorTier1 | SponsorTier2> = T &
    ResolvedSponsorData;
