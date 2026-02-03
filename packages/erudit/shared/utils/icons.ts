import type { MaybeMyIconName } from '#my-icons';

export const ICONS = {
  ['book']: 'book-outline',
  ['group']: 'folder-open',
  ['page']: 'lines',
  ['topic']: 'array-lines',
  ['article']: 'array-lines',
  ['summary']: 'array-star',
  ['practice']: 'array-check',
} satisfies Record<string, MaybeMyIconName>;
