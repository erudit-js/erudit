import { TopicPart } from '../content/topic';
import { ContentType } from '../content/base';

/** Types of prose content inside "content" folder */
export type ContentProseType = TopicPart | ContentType.Page;

export type ProseType = 'newsPost' | ContentProseType;
