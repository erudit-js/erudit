import { PROJECT_DIR } from '#erudit/globalPaths';
import type { NavNode } from '@server/nav/node';

export function contentItemPath(navNode: NavNode, path?: string) {
    return PROJECT_DIR + `/content/${navNode.path}${path ? '/' + path : ''}`;
}
