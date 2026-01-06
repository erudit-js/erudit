import type { ContentType } from '@erudit-js/core/content/type';

export interface ContentChildrenItem {
    type: ContentType;
    link: string;
    title: string;
    description?: string;
    quickLinks?: QuickLink[];
    elementCounts?: ElementCounts;
}
