import type { TopicPart } from '@erudit-js/cog/schema';
import type { QuickLinks } from '@erudit/shared/quickLink';

import type { ContentBaseData } from '@shared/content/data/base';

export type TopicPartLinks = Partial<Record<TopicPart, string>>;

export interface ContentTopicData extends ContentBaseData {
    type: 'topic';
    topicPartLinks: TopicPartLinks;
    bookTitle?: string;
    quickLinks: QuickLinks;
}
