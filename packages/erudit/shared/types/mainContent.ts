import type { ContentType } from '@erudit-js/core/content/type';
import type { TopicPart } from '@erudit-js/core/content/topic';

interface MainContentBase {
    type: ContentType;
    breadcrumbs: Breadcrumbs;
    fullId: string;
}

export type MainContentTopicPart = MainContentBase &
    FinalizedProse & {
        type: 'topic';
        part: TopicPart;
    };

export type MainContentPage = MainContentBase &
    FinalizedProse & {
        type: 'page';
    };

export type MainContentGroup = MainContentBase & {
    type: 'group';
};

export type MainContentBook = MainContentBase & {
    type: 'book';
};

export type MainContent =
    | MainContentTopicPart
    | MainContentPage
    | MainContentGroup
    | MainContentBook;
