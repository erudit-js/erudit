import type { GlobalContributorTypeguard } from '../contributor.js';

export interface ContentContributionDescribed {
    contributor: GlobalContributorTypeguard;
    description: string;
}

export type ContentContribution =
    | GlobalContributorTypeguard
    | ContentContributionDescribed;

export type IContributable = {
    /**
     * List of contributions to this content item.
     * You can access contributors via `$CONTRIBUTOR` global variable:
     * ```ts
     * contributions: [
     *   $CONTRIBUTOR.john,
     *   {
     *     contributor: $CONTRIBUTOR.alice,
     *     description: 'Proposed problem "A game of circles".'
     *   }
     * ],
     * ```
     */
    contributions?: ContentContribution[];
};

//
// Page contributions
//

export interface ContributorContributionItem {
    type: 'topic' | 'page';
    title: string;
    link: string;
}

export interface ContributorContributionBook {
    type: 'book';
    title: string;
    items: ContributorContributionItem[];
}

export type ContributorContribution =
    | ContributorContributionItem
    | ContributorContributionBook;
