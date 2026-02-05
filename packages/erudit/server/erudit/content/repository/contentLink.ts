import { getDefaultTopicPart } from './topicParts';

export async function getContentLink(fullId: string): Promise<string> {
  const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

  switch (navNode.type) {
    case 'book':
    case 'group':
    case 'page':
      return PAGES[navNode.type](navNode.shortId);
  }

  const defaultTopicPart = await getDefaultTopicPart(fullId);

  return PAGES.topic(defaultTopicPart, navNode.shortId);
}
