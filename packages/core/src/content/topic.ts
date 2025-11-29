import {
    finalizeContentItem,
    type ContentItem,
    type ContentItemArg,
} from './item.js';

export const topicParts = ['article', 'summary', 'practice'] as const;

export type TopicPart = (typeof topicParts)[number];

export function isTopicPart(value: string): value is TopicPart {
    return topicParts.includes(value as TopicPart);
}

export type TopicContentItem = ContentItem;

export function defineTopic(topic?: ContentItemArg): TopicContentItem {
    return finalizeContentItem(topic ?? {});
}
