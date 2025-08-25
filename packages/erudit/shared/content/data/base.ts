import type {
    ContentFlag,
    ContentReferences,
    ContentSeo,
    ContentType,
    TopicPart,
} from '@erudit-js/cog/schema';

import type { Context } from '../context';
import type { PreviousNext } from '../previousNext';
import type { ImageData } from '../../image';

export interface ContentGeneric {
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
    generic: ContentGeneric;
}
