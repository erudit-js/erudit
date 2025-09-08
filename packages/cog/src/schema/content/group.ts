import type { ContentConfig } from './type';

export type ContentGroupType = 'separator' | 'folder';
export type ContentConfigGroup = ContentConfig &
    Partial<{ type: ContentGroupType }>;
