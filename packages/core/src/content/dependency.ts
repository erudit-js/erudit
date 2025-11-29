import type { AnyDocument } from '@jsprose/core';

import type { ContentItem } from './item.js';

export interface ContentDependency {
    dependency: AnyDocument | ContentItem;
    reason: string;
}
