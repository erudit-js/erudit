import { ContentType, TopicPart } from '@erudit-js/cog/schema';

import type { MaybeMyIconName } from '#my-icons';

export const ICONS = {
    [ContentType.Book]: 'book-outline',
    [ContentType.Group]: 'folder-open',
    [ContentType.Page]: 'lines',
    [ContentType.Topic]: 'lines-array',
    [TopicPart.Article]: 'lines-array',
    [TopicPart.Summary]: 'star-array',
    [TopicPart.Practice]: 'check-array',
} satisfies Record<string, MaybeMyIconName>;
