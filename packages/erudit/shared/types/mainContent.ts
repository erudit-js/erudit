import type { ProseWithStorage } from 'tsprose';

import type { ContentSeo } from '@erudit-js/core/content/seo';
import type { ContentType } from '@erudit-js/core/content/type';
import type { TopicPart } from '@erudit-js/core/content/topic';
import type { ContentFlags } from '@erudit-js/core/content/flags';
import type { ContentContribution } from '@erudit-js/core/content/contributions';
import type { ResolvedTocItem } from '@erudit-js/prose';

import type { Breadcrumbs } from './breadcrumbs';
import type { ContentStats } from './contentStats';
import type { ContentConnections } from './contentConnections';
import type { ElementSnippet } from './elementSnippet';

export interface MainContentBase {
  type: ContentType;
  breadcrumbs: Breadcrumbs;
  fullId: string;
  shortId: string;
  contentRelativePath: string;
  title: string;
  bookTitle?: string;
  description?: string;
  decoration?: string;
  flags?: ContentFlags;
  stats?: ContentStats;
  connections?: ContentConnections;
  contributions?: ContentContribution[];
  seo?: ContentSeo;
}

export interface MainContentChildrenItem {
  type: ContentType;
  link: string;
  title: string;
  description?: string;
  quickLinks?: ElementSnippet[];
  stats?: ContentStats;
}

//
//
//

export type MainContentTopicPart = MainContentBase &
  ProseWithStorage & {
    type: 'topic';
    part: TopicPart;
    parts: TopicPart[];
    snippets?: ElementSnippet[];
    toc?: ResolvedTocItem[];
  };

export type MainContentPage = MainContentBase &
  ProseWithStorage & {
    type: 'page';
    snippets?: ElementSnippet[];
    toc?: ResolvedTocItem[];
  };

export type MainContentGroup = MainContentBase & {
  type: 'group';
  children: MainContentChildrenItem[];
};

export type MainContentBook = MainContentBase & {
  type: 'book';
  children: MainContentChildrenItem[];
};

export type MainContent =
  | MainContentTopicPart
  | MainContentPage
  | MainContentGroup
  | MainContentBook;
