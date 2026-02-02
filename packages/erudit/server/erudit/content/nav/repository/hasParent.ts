import type { ContentNavNode } from '../types';

export function hasParent(node: ContentNavNode): boolean {
  return !!node.parent;
}
