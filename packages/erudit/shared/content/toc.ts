import type { ContentType } from '@erudit-js/cog/schema';

import type { ElementStats } from '../stat';
import type { QuickLinks } from '../quickLink';

interface ContentTocBaseItem {
    type: ContentType;
    link: string;
    title: string;
    description?: string;
}

export interface ContentTocBookItem extends ContentTocBaseItem {
    type: 'book';
    topicCount: number;
    stats: ElementStats;
}

export interface ContentTocGroupItem extends ContentTocBaseItem {
    type: 'group';
    topicCount: number;
    stats: ElementStats;
}

export interface ContentTocTopicItem extends ContentTocBaseItem {
    type: 'topic';
    quickLinks: QuickLinks;
}

export type ContentTocItem =
    | ContentTocBookItem
    | ContentTocGroupItem
    | ContentTocTopicItem;

export type ContentToc = ContentTocItem[];
