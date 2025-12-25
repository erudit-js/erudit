import { finalizeContentItem, type ContentItemBase } from './item.js';

export interface GroupContentItem extends ContentItemBase {
    type?: 'folder' | 'separator';
}

export function defineGroup(group?: GroupContentItem) {
    return finalizeContentItem('group', group ?? {});
}
