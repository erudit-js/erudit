export interface EruditSponsors {
    enabled: boolean;
    becomeSponsorLink: string;
    tier1Label: string;
    tier2Label: string;
    defaultSponsorMessages: string[];
}

interface BaseSponsor {
    sponsorId: string;
    tier: 1 | 2;
    name?: string;
    icon?: string;
    avatarExtension?: string;
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

type SponsorOmit = 'sponsorId' | 'avatarExtension' | 'icon';

export type SponsorConfig =
    | Omit<SponsorTier1, SponsorOmit>
    | Omit<SponsorTier2, SponsorOmit>;

export function defineSponsor(sponsor: SponsorConfig) {
    return sponsor;
}
