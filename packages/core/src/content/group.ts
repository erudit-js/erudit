import {
    finalizeContentItem,
    type ContentItem,
    type ContentItemArg,
} from './item.js';

export type GroupData = Partial<{
    type: 'folder' | 'separator';
}>;

export type GroupContentItem = ContentItem<GroupData>;

export function defineGroup(
    group?: ContentItemArg<GroupData>,
): GroupContentItem {
    return finalizeContentItem(group ?? {});
}
