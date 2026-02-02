export function orderIds(contentIds: string[]): string[] {
  const idsSet = new Set(contentIds);
  const orderedIds: string[] = [];

  ERUDIT.contentNav.walkSync((node) => {
    if (idsSet.has(node.fullId)) {
      orderedIds.push(node.fullId);
    } else if (idsSet.has(node.shortId)) {
      orderedIds.push(node.shortId);
    }
  });

  return orderedIds;
}
