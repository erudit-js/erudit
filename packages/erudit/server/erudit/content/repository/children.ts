import { getContentDescription } from './description';

export async function getContentChildren(
  fullContentId?: string,
): Promise<MainContentChildrenItem[]> {
  const navNode = fullContentId
    ? ERUDIT.contentNav.getNodeOrThrow(fullContentId)
    : { children: Array.from(ERUDIT.contentNav.id2Root.values()) };
  const children: MainContentChildrenItem[] = [];

  for (const childNode of navNode.children ?? []) {
    const hidden = await ERUDIT.repository.content.hidden(childNode.fullId);
    if (hidden) {
      continue;
    }

    const type = childNode.type;
    const link = await ERUDIT.repository.content.link(childNode.fullId);
    const title = await ERUDIT.repository.content.title(
      childNode.fullId,
      'nav',
    );
    const description = await getContentDescription(childNode.fullId);
    const elementSnippets = await ERUDIT.repository.content.elementSnippets(
      childNode.fullId,
    );
    const keyLinks = elementSnippets?.filter((snippet) => snippet.key);
    const stats = await ERUDIT.repository.content.stats(childNode.fullId);

    const child: MainContentChildrenItem = {
      type,
      link,
      title,
    };

    if (description) {
      child.description = description;
    }

    if (keyLinks && keyLinks.length > 0) {
      child.keyLinks = keyLinks;
    }

    if (stats) {
      child.stats = stats;
    }

    children.push(child);
  }

  return children;
}
