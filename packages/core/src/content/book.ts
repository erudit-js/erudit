import {
  finalizeContentItem,
  type ContentItem,
  type TypelessContentItem,
} from './item.js';

export interface BookContentItem extends ContentItem {
  type: 'book';
}

export function defineBook(book?: TypelessContentItem<BookContentItem>) {
  return finalizeContentItem('book', book ?? {});
}
