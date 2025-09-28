import { ContentType } from '@erudit-js/cog/schema';

import type { MaybeMyIconName } from '#my-icons';

export const ICONS = {
    [ContentType.Book]: 'book-outline',
    [ContentType.Group]: 'folder-open',
    [ContentType.Page]: 'lines',
    [ContentType.Topic]: 'lines-array',
} satisfies Record<string, MaybeMyIconName>;
