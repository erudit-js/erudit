import {
  finalizeContentItem,
  type ContentItem,
  type TypelessContentItem,
} from './item.js';

export interface GroupContentItem extends ContentItem {
  type: 'group';
  separator?: boolean;
}

export function defineGroup(group?: TypelessContentItem<GroupContentItem>) {
  return finalizeContentItem('group', group ?? {});
}
