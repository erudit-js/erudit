import type { TopicPart } from './topic.js';
import type { ContentType } from './type.js';

interface BasePointer {
    type: ContentType;
    id: string;
}

export interface GenericContentPointer extends BasePointer {
    type: Exclude<ContentType, 'topic'>;
}

export interface TopicContentPointer extends BasePointer {
    type: 'topic';
    part: TopicPart;
}

export type ContentPointer = GenericContentPointer | TopicContentPointer;
