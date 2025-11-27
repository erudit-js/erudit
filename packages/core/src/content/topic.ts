export const topicParts = ['article', 'summary', 'practice'] as const;

export type TopicPart = (typeof topicParts)[number];

export function isTopicPart(value: string): value is TopicPart {
    return topicParts.includes(value as TopicPart);
}
