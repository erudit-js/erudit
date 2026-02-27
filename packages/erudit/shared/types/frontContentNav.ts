import type { ContentFlags } from '@erudit-js/core/content/flags';
import type { TopicPart } from '@erudit-js/core/content/topic';

export interface FrontContentNavItemBase {
  shortId: string;
  title: string;
  link: string;
  flags: ContentFlags;
}

export interface FrontContentNavTopic extends FrontContentNavItemBase {
  type: 'topic';
  parts: TopicPart[];
}

export interface FrontContentNavPage extends FrontContentNavItemBase {
  type: 'page';
}

export interface FrontContentNavGroup extends FrontContentNavItemBase {
  type: 'group';
  separator: boolean;
  children: FrontContentNavItem[];
}

export interface FrontContentNavBook extends FrontContentNavItemBase {
  type: 'book';
  children: FrontContentNavItem[];
}

export type FrontContentNavItem =
  | FrontContentNavTopic
  | FrontContentNavPage
  | FrontContentNavGroup
  | FrontContentNavBook;

export type FrontGlobalContentNav = {
  bookShortIds: string[];
  frontNavItems: FrontContentNavItem[];
};
