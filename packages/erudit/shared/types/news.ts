import type { ProseWithStorage } from 'tsprose';

export interface NewsBatch {
  items: NewsItem[];
  nextIndex?: number;
  /** Only present in the first batch with index 0! */
  total?: number;
}

export interface NewsItem {
  date: string;
  content: ProseWithStorage;
}
