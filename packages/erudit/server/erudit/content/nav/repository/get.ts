import type { ContentNavNode } from '../types';

export function getNode(fullOrShortId: string): ContentNavNode {
    let foundNode: ContentNavNode | undefined =
        ERUDIT.contentNav.id2Node.get(fullOrShortId);

    if (foundNode) {
        return foundNode;
    }

    const fullId = ERUDIT.contentNav.short2Full.get(fullOrShortId);
    if (fullId) {
        foundNode = ERUDIT.contentNav.id2Node.get(fullId);
        if (foundNode) {
            return foundNode;
        }
    }

    throw createError({
        statusCode: 404,
        statusMessage: `Content nav node not found: "${fullOrShortId}"!`,
    });
}
