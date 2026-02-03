export interface EruditSponsors {
  enabled: boolean;
  becomeSponsorLink: string;
  defaultSponsorMessages: string[];
}

export interface Sponsor {
  sponsorId: string;
  name?: string;
  group?: string;
  icon?: string;
  avatarExtension?: string;
  info?: string;
  color?: string;
  link?: string;
  messages?: {
    enabled: boolean;
    list?: string[];
  };
}

type SponsorOmit = 'sponsorId' | 'avatarExtension';

export type SponsorConfig = Omit<Sponsor, SponsorOmit>;

export function defineSponsor(sponsor: SponsorConfig) {
  return sponsor;
}

export interface PageSponsor {
  name: string;
  group?: string;
  icon?: string;
  info?: string;
  color?: string;
  link?: string;
  avatarUrl?: string;
}
