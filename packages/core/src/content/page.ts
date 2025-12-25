import { finalizeContentItem, type ContentItemBase } from './item.js';

export type PageContentItem = ContentItemBase;

export function definePage(page?: PageContentItem) {
    return finalizeContentItem('page', page ?? {});
}
