import type { GlobalContributorTypeguard } from '../contributor.js';

export interface ContentContributionDescribed {
    contributor: GlobalContributorTypeguard;
    description: string;
}

export type ContentContribution =
    | GlobalContributorTypeguard
    | ContentContributionDescribed;
