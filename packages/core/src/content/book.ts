import {
    finalizeContentItem,
    type ContentItem,
    type ContentItemArg,
} from './item.js';

export type BookContentItem = ContentItem;

export function defineBook(book?: ContentItemArg): BookContentItem {
    return finalizeContentItem('book', book ?? {});
}
