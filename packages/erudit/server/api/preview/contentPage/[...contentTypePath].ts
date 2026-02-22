import { eq } from 'drizzle-orm';

export default defineEventHandler<Promise<PreviewContentPage>>(
  async (event) => {
    // <typeOrPart>/<fullOrShortId>.json
    const strContentTypePath = event.context.params!.contentTypePath!.slice(
      0,
      -5,
    );

    const contentTypePath = parseContentTypePath(strContentTypePath);
    const fullId = contentTypePath.contentId;
    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
    const shortId = navNode.shortId;

    const dbContent = (await ERUDIT.db.query.content.findFirst({
      columns: {
        title: true,
        description: true,
      },
      where: eq(ERUDIT.db.schema.content.fullId, fullId),
    }))!;

    const bookNavNode = ERUDIT.contentNav.getBookFor(fullId);
    let bookTitle: string | undefined;

    if (bookNavNode) {
      const dbBook = (await ERUDIT.db.query.content.findFirst({
        columns: {
          title: true,
        },
        where: eq(ERUDIT.db.schema.content.fullId, bookNavNode.fullId),
      }))!;

      bookTitle = dbBook.title;
    }

    const link = (() => {
      if (contentTypePath.type === 'topic') {
        return PAGES.topic(contentTypePath.topicPart, shortId);
      }

      return PAGES[contentTypePath.type](shortId);
    })();

    const previewContentPage: PreviewContentPage = {
      content:
        contentTypePath.type === 'topic'
          ? {
              type: 'topic',
              topicPart: contentTypePath.topicPart,
            }
          : { type: contentTypePath.type },
      link,
      title: dbContent.title,
      description: dbContent.description ?? undefined,
      bookTitle,
    };

    return previewContentPage;
  },
);
