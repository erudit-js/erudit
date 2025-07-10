import type {
    ContentReferenceSource,
    ContentType,
} from '@erudit-js/cog/schema';

export interface ContentSourceUsage {
    type: ContentType;
    title: string;
    link: string;
    count: number;
}

export interface ContentSourceUsageSetItem {
    source: ContentReferenceSource;
    usages: ContentSourceUsage[];
}

export type ContentSourceUsageSet = ContentSourceUsageSetItem[];
