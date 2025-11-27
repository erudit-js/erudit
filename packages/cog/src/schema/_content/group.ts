import type { ContentConfig } from './base';

export type ContentGroupType = 'separator' | 'folder';
export type ContentConfigGroup = ContentConfig &
    Partial<{ type: ContentGroupType }>;
