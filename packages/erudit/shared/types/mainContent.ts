import type { ContentType, TopicPart } from '@erudit-js/cog/schema';
import type { ApiProse } from './prose';

interface MainContentBase {
    type: ContentType;
    breadcrumbs: Breadcrumbs;
}

export type MainContentTopicPart = MainContentBase &
    ApiProse & {
        type: ContentType.Topic;
        part: TopicPart;
    };

export type MainContentPage = MainContentBase &
    ApiProse & {
        type: ContentType.Page;
    };

export type MainContent = MainContentTopicPart | MainContentPage;
