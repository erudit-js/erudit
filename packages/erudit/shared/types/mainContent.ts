import type { FinalizedProse } from '@jsprose/core';
import type { ContentType } from '@erudit-js/core/content/type';
import type { TopicPart } from '@erudit-js/core/content/topic';
import type { ContentFlags } from '@erudit-js/core/content/flags';

export interface MainContentBase {
    type: ContentType;
    breadcrumbs: Breadcrumbs;
    fullId: string;
    title: string;
    description?: string;
    decoration?: string;
    flags?: ContentFlags;
    stats?: ContentStats;
    connections?: ContentConnections;
}

export interface MainContentChildrenItem {
    type: ContentType;
    link: string;
    title: string;
    description?: string;
    quickLinks?: QuickLink[];
    stats?: ContentStats;
}

//
//
//

export type MainContentTopicPart = MainContentBase &
    FinalizedProse & {
        type: 'topic';
        shortContentId: string;
        part: TopicPart;
        parts: TopicPart[];
        quickLinks?: QuickLink[];
    };

export type MainContentPage = MainContentBase &
    FinalizedProse & {
        type: 'page';
        quickLinks?: QuickLink[];
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
