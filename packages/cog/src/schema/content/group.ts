import type { ContentConfig } from './config';

export type ContentGroupType = 'separator' | 'folder';
export type ContentConfigGroup = ContentConfig &
    Partial<{ type: ContentGroupType }>;
