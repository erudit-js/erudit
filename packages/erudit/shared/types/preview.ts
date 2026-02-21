import type { ProseWithStorage } from 'tsprose';

import type { PreviewRequest } from '@erudit-js/core/preview/request';
import type { ContentType } from '@erudit-js/core/content/type';

export type PreviewState = {
  opened: boolean;
  request: PreviewRequest | undefined;
  history: PreviewRequest[];
  blink: number;
};

export type PreviewContentPage = {
  content:
    | { type: 'topic'; topicPart: string }
    | { type: Exclude<ContentType, 'topic'> };
  title: string;
  description?: string;
  bookTitle?: string;
  link: string;
};

export type PreviewContentUnique = {
  link: string;
  contentTitle: string;
  elementTitle?: string;
  schemaName: string;
  fadeOverlay?: boolean;
} & ProseWithStorage;
