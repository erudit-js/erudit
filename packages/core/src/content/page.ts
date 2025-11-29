import {
    finalizeContentItem,
    type ContentItem,
    type ContentItemArg,
} from './item.js';

export type PageContentItem = ContentItem;

export function definePage(page?: ContentItemArg): PageContentItem {
    return finalizeContentItem(page ?? {});
}
