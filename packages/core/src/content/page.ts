import {
    finalizeContentItem,
    type ContentItem,
    type TypelessContentItem,
} from './item.js';

export interface PageContentItem extends ContentItem {
    type: 'page';
}

export function definePage(page?: TypelessContentItem<PageContentItem>) {
    return finalizeContentItem('page', page ?? {});
}
