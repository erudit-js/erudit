import type {
    ContentFlag,
    ContentReferences,
    ContentSeo,
    ContentType,
    TopicPart,
} from '@erudit-js/cog/schema';

import type { Context } from '@shared/content/context';
import type { PreviousNext } from '@shared/content/previousNext';
import type { ImageData } from '@shared/image';

export interface ContentGenericData {
    contentId: string;
    title?: string;
    description?: string;
    decoration?: string;
    type: ContentType;
    context: Context;
    flags: Record<ContentFlag, boolean>;
    topicPart?: TopicPart;
    seo?: Partial<ContentSeo>;
    ogImage?: ImageData;
    previousNext: PreviousNext;
    dependencies?: Record<string, string>;
    references?: ContentReferences;
}

export interface ContentBaseData {
    type: ContentType;
    generic: ContentGenericData;
}
