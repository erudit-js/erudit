import type { ContentNavNode } from '../types';

export function getNode(fullOrShortId: string): ContentNavNode | undefined {
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

  return undefined;
}

export function getNodeOrThrow(fullOrShortId: string): ContentNavNode {
  const foundNode = getNode(fullOrShortId);

  if (!foundNode) {
    throw createError({
      statusCode: 404,
      statusMessage: `Content nav node not found: "${fullOrShortId}"!`,
    });
  }

  return foundNode;
}
