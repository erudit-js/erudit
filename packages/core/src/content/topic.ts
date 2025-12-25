import { finalizeContentItem, type ContentItemBase } from './item.js';

export const topicParts = ['article', 'summary', 'practice'] as const;

export type TopicPart = (typeof topicParts)[number];

export function isTopicPart(value: unknown): value is TopicPart {
    return topicParts.includes(value as TopicPart);
}

export type TopicContentItem = ContentItemBase;

export function defineTopic(topic?: TopicContentItem) {
    return finalizeContentItem('topic', topic ?? {});
}
