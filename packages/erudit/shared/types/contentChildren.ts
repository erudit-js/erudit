import type { ContentType } from '@erudit-js/core/content/type';

import type { ElementSnippet } from './elementSnippet';
import type { ContentStats } from './contentStats';

export interface ContentChildrenItem {
  type: ContentType;
  link: string;
  title: string;
  description?: string;
  keyLinks?: ElementSnippet[];
  elementCounts?: ContentStats['elements'];
}
