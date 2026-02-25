import type { GlobalContributorTypeguard } from '../contributor.js';

export interface ConfigContributionDescribed {
  contributor: GlobalContributorTypeguard;
  description?: string;
}

export type ConfigContribution =
  | GlobalContributorTypeguard
  | ConfigContributionDescribed;

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
  contributions?: ConfigContribution[];
};

//
// Content page contributions
//

export interface ContentContribution {
  contributorId: string;
  name?: string;
  avatarUrl?: string;
  description?: string;
}

//
// Contributor page contributions
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
