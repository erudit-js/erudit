import { and, asc, eq, or } from 'drizzle-orm';

export async function getContentElementSnippets(
  fullId: string,
): Promise<ElementSnippet[] | undefined> {
  const snippets: ElementSnippet[] = [];

  const dbSnippets = await ERUDIT.db.query.contentSnippets.findMany({
    columns: {
      contentProseType: true,
      schemaName: true,
      elementId: true,
      snippetData: true,
    },
    where: and(
      eq(ERUDIT.db.schema.contentSnippets.contentFullId, fullId),
      or(
        eq(ERUDIT.db.schema.contentSnippets.key, true),
        eq(ERUDIT.db.schema.contentSnippets.seo, true),
      ),
    ),
    orderBy: (snippets) => asc(snippets.snippetId),
  });

  const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

  for (const dbSnippet of dbSnippets) {
    const link = (() => {
      if (dbSnippet.contentProseType === 'page') {
        return PAGES.page(navNode.shortId, dbSnippet.elementId);
      }

      return PAGES.topic(
        dbSnippet.contentProseType,
        navNode.shortId,
        dbSnippet.elementId,
      );
    })();

    const snippetData = dbSnippet.snippetData;

    const snippet: ElementSnippet = {
      link,
      schemaName: dbSnippet.schemaName,
      title: snippetData.title!,
    };

    if (snippetData.key) {
      snippet.key = {};
      let keyTitle: string | undefined;
      let keyDescription: string | undefined;

      if (typeof snippetData.key === 'string') {
        keyTitle = snippetData.key;
      } else if (typeof snippetData.key === 'object') {
        if (snippetData.key.title) {
          keyTitle = snippetData.key.title;
        }
        if (snippetData.key.description) {
          keyDescription = snippetData.key.description;
        }
      }

      if (keyTitle) {
        snippet.key.title = keyTitle;
      }
      if (keyDescription) {
        snippet.key.description = keyDescription;
      }
    }

    if (snippetData.seo) {
      snippet.seo = {};

      let seoTitle: string | undefined;
      let seoDescription: string | undefined;

      if (typeof snippetData.seo === 'string') {
        seoTitle = snippetData.seo;
      } else if (typeof snippetData.seo === 'object') {
        if (snippetData.seo.title) {
          seoTitle = snippetData.seo.title;
        }
        if (snippetData.seo.description) {
          seoDescription = snippetData.seo.description;
        }
      }

      if (seoTitle) {
        snippet.seo.title = seoTitle;
      }
      if (seoDescription) {
        snippet.seo.description = seoDescription;
      }
    }

    if (snippetData.description) {
      snippet.description = snippetData.description;
    }

    snippets.push(snippet);
  }

  return snippets.length > 0 ? snippets : undefined;
}
