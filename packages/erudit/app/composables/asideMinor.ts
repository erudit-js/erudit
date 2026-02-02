import type {
  ContentContribution,
  ContributorContribution,
} from '@erudit-js/core/content/contributions';
import type { TopicPart } from '@erudit-js/core/content/topic';
import type { ContentType } from '@erudit-js/core/content/type';
import type { ResolvedTocItem } from '@erudit-js/prose';

export interface AsideMinorStateNews {
  type: 'news';
}

export interface AsideMinorContributor {
  type: 'contributor';
  contributions?: ContributorContribution[];
}

export interface AsideMinorContentContributions {
  type: 'content-contributions';
  contentRelativePath: string;
  contentType: ContentType;
  topicPart?: TopicPart;
  contributions?: ContentContribution[];
}

export interface AsideMinorContentPage {
  type: 'content-page';
  contentRelativePath: string;
  toc?: ResolvedTocItem[];
  contributions?: ContentContribution[];
}

export interface AsideMinorContentTopic {
  type: 'content-topic';
  topicPart: TopicPart;
  contentRelativePath: string;
  shortContentId: string;
  parts: TopicPart[];
  toc?: ResolvedTocItem[];
  contributions?: ContentContribution[];
}

export type AsideMinorState =
  | AsideMinorStateNews
  | AsideMinorContributor
  | AsideMinorContentContributions
  | AsideMinorContentPage
  | AsideMinorContentTopic;

export const useAsideMinor = () => {
  const asideMinor = useState<AsideMinorState | undefined>('aside-minor');

  return {
    asideMinorState: asideMinor,
    showNewsAside() {
      asideMinor.value = { type: 'news' };
    },
    showContributorAside(contributions?: ContributorContribution[]) {
      asideMinor.value = {
        type: 'contributor',
        contributions,
      };
    },
    showContentContributionsAside(
      contentRelativePath: string,
      contentType: ContentType,
      topicPart?: TopicPart,
      contributions?: ContentContribution[],
    ) {
      asideMinor.value = {
        type: 'content-contributions',
        contentRelativePath,
        contentType,
        topicPart,
        contributions,
      };
    },
    showContentPageAside(
      contentRelativePath: string,
      toc?: ResolvedTocItem[],
      contributions?: ContentContribution[],
    ) {
      asideMinor.value = {
        type: 'content-page',
        contentRelativePath,
        toc,
        contributions,
      };
    },
    showContentTopicAside(args: {
      part: TopicPart;
      parts: TopicPart[];
      shortContentId: string;
      contentRelativePath: string;
      toc?: ResolvedTocItem[];
      contributions?: ContentContribution[];
    }) {
      asideMinor.value = {
        type: 'content-topic',
        topicPart: args.part,
        contentRelativePath: args.contentRelativePath,
        toc: args.toc,
        contributions: args.contributions,
        shortContentId: args.shortContentId,
        parts: args.parts,
      };
    },
  };
};
