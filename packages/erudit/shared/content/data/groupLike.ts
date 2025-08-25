import type { ElementStat } from '../../stat';
import type { ContentToc } from '../toc';
import type { ContentSourceUsageSet } from '../reference';

export interface ContentGroupLike {
    contentToc: ContentToc;
    readLink: string;
    topicCount: number;
    elementStats?: ElementStat[];
    sourceUsageSet?: ContentSourceUsageSet;
}
