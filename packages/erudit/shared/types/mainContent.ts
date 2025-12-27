import type { ContentType } from '@erudit-js/core/content/type';
import type { TopicPart } from '@erudit-js/core/content/topic';

export interface MainContentBase {
    type: ContentType;
    breadcrumbs: Breadcrumbs;
    fullId: string;
    title: string;
    description?: string;
    decoration?: string;
}

export interface MainContentChildrenItem {
    type: ContentType;
    link: string;
    title: string;
    description?: string;
    /* TODO: Quick Links */
}

//
//
//

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
