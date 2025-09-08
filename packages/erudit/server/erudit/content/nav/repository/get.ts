import type { ContentNavNode } from '../types';

export function getNode(fullOrShortId: string): ContentNavNode | undefined {
    const fullNode = ERUDIT.contentNav.id2Node.get(fullOrShortId);

    if (fullNode) {
        return fullNode;
    }

    const fullId = ERUDIT.contentNav.short2Full.get(fullOrShortId);

    if (fullId) {
        return ERUDIT.contentNav.id2Node.get(fullId);
    }
}
