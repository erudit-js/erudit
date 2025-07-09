import type { ElementStat } from '@shared/stat';
import type { ContentToc } from '@shared/content/toc';
import type { ContentSourceUsageSet } from '@shared/content/reference';

export interface ContentGroupLike {
    contentToc: ContentToc;
    readLink: string;
    topicCount: number;
    elementStats?: ElementStat[];
    sourceUsageSet?: ContentSourceUsageSet;
}
