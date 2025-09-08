export function toFullId(fullOrShortId: string) {
    const node = ERUDIT.contentNav.getNode(fullOrShortId);
    return node && node.fullId;
}

export function toShortId(fullOrShortId: string) {
    const node = ERUDIT.contentNav.getNode(fullOrShortId);
    return node && node.shortId;
}
