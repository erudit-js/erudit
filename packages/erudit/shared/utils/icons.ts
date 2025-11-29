import type { MaybeMyIconName } from '#my-icons';

export const ICONS = {
    ['book']: 'book-outline',
    ['group']: 'folder-open',
    ['page']: 'lines',
    ['topic']: 'lines-array',
    ['article']: 'lines-array',
    ['summary']: 'star-array',
    ['practice']: 'check-array',
} satisfies Record<string, MaybeMyIconName>;
