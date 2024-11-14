import type { ContentConfig } from './base';

export type GroupType = 'separator' | 'folder';

export interface GroupConfig extends Partial<ContentConfig> {
    type: GroupType;
}
