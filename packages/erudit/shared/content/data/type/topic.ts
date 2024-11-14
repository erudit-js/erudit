import type { TopicPart } from 'erudit-cog/schema';

import type { ContentBaseData } from '../base';

export type TopicPartLinks = Partial<Record<TopicPart, string>>;

export interface ContentTopicData extends ContentBaseData {
    type: 'topic';
    topicPartLinks: TopicPartLinks;
    bookTitle?: string;
}
