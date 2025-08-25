import { ContentNavNode } from '../types';

export function hasChildren(node: ContentNavNode): boolean {
    return (node.children?.length ?? 0) > 0;
}
