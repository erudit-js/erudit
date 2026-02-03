import { and, eq } from 'drizzle-orm';

export default defineEventHandler<Promise<MainContent>>(async (event) => {
  const strContentTypePath = event.context.params?.contentTypePath;
  const contentTypePath = parseContentTypePath(strContentTypePath!);
  const navNode = ERUDIT.contentNav.getNodeOrThrow(contentTypePath.contentId);
  const fullId = navNode.fullId;
  const shortId = navNode.shortId;
  const contentRelativePath = navNode.contentRelPath;
  const title = await ERUDIT.repository.content.title(fullId);
  const description = await ERUDIT.repository.content.description(fullId);
  const decoration = await ERUDIT.repository.content.decoration(fullId);
  const elementSnippets =
    await ERUDIT.repository.content.elementSnippets(fullId);
  const flags = await ERUDIT.repository.content.flags(fullId);
  const stats = await ERUDIT.repository.content.stats(fullId);
  const connections = await ERUDIT.repository.content.connections(fullId);
  const contributions = await ERUDIT.repository.content.contentContributions(
    fullId,
    ['topic', 'page'].includes(contentTypePath.type),
  );
  const seo = await ERUDIT.repository.content.seo(fullId);

  const bookNode = ERUDIT.contentNav.getBookFor(fullId);
  const bookTitle = bookNode
    ? await ERUDIT.repository.content.title(bookNode.fullId)
    : undefined;

  //
  // Base
  //
  const mainContentBase: Omit<MainContentBase, 'type'> = {
    fullId,
    shortId,
    contentRelativePath,
    title,
    bookTitle,
    breadcrumbs: await ERUDIT.repository.content.breadcrumbs(fullId),
    seo,
  };

  if (description) {
    mainContentBase.description = description;
  }

  if (decoration) {
    mainContentBase.decoration = decoration;
  }

  if (flags) {
    mainContentBase.flags = flags;
  }

  if (stats) {
    mainContentBase.stats = stats;
  }

  if (connections) {
    mainContentBase.connections = connections;
  }

  if (contributions) {
    mainContentBase.contributions = contributions;
  }

  if (contentTypePath.type === 'page' || contentTypePath.type === 'topic') {
    const proseElement = await ERUDIT.repository.prose.getContent(
      contentTypePath.type === 'topic'
        ? contentTypePath.topicPart
        : contentTypePath.type,
      fullId,
    );

    const topicParts = await ERUDIT.repository.content.topicParts(fullId);
    const { storage } = await ERUDIT.repository.prose.finalize(proseElement);

    const where = (() => {
      if (contentTypePath.type === 'topic') {
        return and(
          eq(ERUDIT.db.schema.contentToc.fullId, fullId),
          eq(ERUDIT.db.schema.contentToc.topicPart, contentTypePath.topicPart),
        );
      }

      return eq(ERUDIT.db.schema.contentToc.fullId, fullId);
    })();

    const tocItems = (
      await ERUDIT.db.query.contentToc.findFirst({
        columns: { toc: true },
        where,
      })
    )?.toc;

    //
    // Topic
    //
    if (contentTypePath.type === 'topic') {
      const mainContentTopicPart: MainContentTopicPart = {
        ...mainContentBase,
        type: 'topic',
        part: contentTypePath.topicPart,
        parts: topicParts,
        proseElement,
        storage,
      };

      if (elementSnippets) {
        mainContentTopicPart.snippets = elementSnippets;
      }

      if (tocItems) {
        mainContentTopicPart.toc = tocItems;
      }

      return mainContentTopicPart;
    }

    //
    // Page
    //

    const mainContentPage: MainContentPage = {
      ...mainContentBase,
      type: 'page',
      proseElement,
      storage,
    };

    if (elementSnippets) {
      mainContentPage.snippets = elementSnippets;
    }

    if (tocItems) {
      mainContentPage.toc = tocItems;
    }

    return mainContentPage;
  }

  //
  // Rest content types
  //
  return {
    ...mainContentBase,
    type: contentTypePath.type,
    children: await ERUDIT.repository.content.children(fullId),
  } satisfies MainContentGroup | MainContentBook;
});
