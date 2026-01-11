import type { IContributable } from './contributions.js';
import {
    finalizeContentItem,
    type ContentItem,
    type TypelessContentItem,
} from './item.js';

export const topicParts = ['article', 'summary', 'practice'] as const;

export type TopicPart = (typeof topicParts)[number];

export function isTopicPart(value: unknown): value is TopicPart {
    return topicParts.includes(value as TopicPart);
}

export interface TopicContentItem extends ContentItem, IContributable {
    type: 'topic';
}

export function defineTopic(topic?: TypelessContentItem<TopicContentItem>) {
    return finalizeContentItem('topic', topic ?? {});
}
