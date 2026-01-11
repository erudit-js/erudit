import type { IContributable } from './contributions.js';
import {
    finalizeContentItem,
    type ContentItem,
    type TypelessContentItem,
} from './item.js';

export interface PageContentItem extends ContentItem, IContributable {
    type: 'page';
}

export function definePage(page?: TypelessContentItem<PageContentItem>) {
    return finalizeContentItem('page', page ?? {});
}
