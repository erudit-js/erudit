import type { ContentType } from '@erudit-js/core/content/type';
import type { TopicPart } from '@erudit-js/core/content/topic';

interface MainContentBase {
    type: ContentType;
    breadcrumbs: Breadcrumbs;
}

export type MainContentTopicPart = MainContentBase &
    ResolvedProse & {
        type: 'topic';
        part: TopicPart;
    };

export type MainContentPage = MainContentBase &
    ResolvedProse & {
        type: 'page';
    };

export type MainContent = MainContentTopicPart | MainContentPage;
