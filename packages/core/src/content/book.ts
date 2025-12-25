import { finalizeContentItem, type ContentItemBase } from './item.js';

export type BookContentItem = ContentItemBase;

export function defineBook(book?: BookContentItem) {
    return finalizeContentItem('book', book ?? {});
}
