import type { ContentConfig } from './base';

export enum TopicPart {
    Article = 'article',
    Summary = 'summary',
    Practice = 'practice',
}

export function isTopicPart(value: any): value is TopicPart {
    return Object.values(TopicPart).includes(value);
}

export type ContentConfigTopic = ContentConfig;
