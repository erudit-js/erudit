import { eq } from 'drizzle-orm';
import { contentTypes } from '@erudit-js/core/content/type';
import { headingSchema } from '@erudit-js/prose/elements/heading/core';
import type { TopicPart } from '@erudit-js/core/content/topic';

export async function searchIndexContentTypes(): Promise<SearchEntriesList[]> {
  const entryLists: SearchEntriesList[] = [];

  for (const contentType of contentTypes) {
    const dbContentItems = await ERUDIT.db.query.content.findMany({
      columns: {
        fullId: true,
        title: true,
        description: true,
        type: true,
      },
      where: (fields) => eq(fields.type, contentType),
    });

    const entries: SearchEntry[] = [];

    for (const dbContentItem of dbContentItems) {
      const hidden = await ERUDIT.repository.content.hidden(
        dbContentItem.fullId,
      );
      if (hidden) {
        continue;
      }

      const bookTitle: string | undefined = await (async () => {
        if (dbContentItem.type === 'book') {
          return undefined;
        }

        const itemBook = ERUDIT.contentNav.getBookFor(dbContentItem.fullId);

        if (itemBook) {
          const bookId = itemBook.fullId;
          const dbBook = await ERUDIT.db.query.content.findFirst({
            columns: { title: true },
            where: eq(ERUDIT.db.schema.content.fullId, bookId),
          });
          return dbBook?.title;
        }
      })();

      entries.push({
        category: contentType,
        title: dbContentItem.title,
        description: dbContentItem.description || undefined,
        link: await ERUDIT.repository.content.link(dbContentItem.fullId),
        location: bookTitle,
      } satisfies SearchEntry);
    }

    entryLists.push({
      category: {
        id: contentType,
        priority: 200,
      },
      entries,
    });
  }

  return entryLists;
}

export async function searchIndexSnippets(): Promise<SearchEntriesList[]> {
  const entryLists: Map<string, SearchEntriesList> = new Map();

  const dbSnippets = await ERUDIT.db.query.contentSnippets.findMany({
    where: eq(ERUDIT.db.schema.contentSnippets.search, true),
  });

  for (const dbSnippet of dbSnippets) {
    const contentFullId = dbSnippet.contentFullId;
    const hidden = await ERUDIT.repository.content.hidden(contentFullId);
    if (hidden) {
      continue;
    }

    if (!entryLists.has(dbSnippet.schemaName)) {
      entryLists.set(dbSnippet.schemaName, {
        category: {
          id: 'element:' + dbSnippet.schemaName,
          priority: dbSnippet.schemaName === headingSchema.name ? 325 : 350,
        },
        entries: [],
      });
    }

    const navNode = ERUDIT.contentNav.getNodeOrThrow(dbSnippet.contentFullId);
    let link: string;

    const locationTitle = await (async () => {
      const dbContentItem = await ERUDIT.db.query.content.findFirst({
        columns: { title: true },
        where: eq(ERUDIT.db.schema.content.fullId, dbSnippet.contentFullId),
      });

      return dbContentItem?.title;
    })();

    switch (navNode.type) {
      case 'page':
        link = PAGES[navNode.type](navNode.shortId, dbSnippet.elementId);
        break;
      case 'topic':
        link = PAGES['topic'](
          dbSnippet.contentProseType as TopicPart,
          navNode.shortId,
          dbSnippet.elementId,
        );
        break;
      default:
        throw createError({
          statusCode: 500,
          statusMessage: `Cannot create search snippet link for content type "${navNode.type}"!`,
        });
    }

    const snippetSearch = dbSnippet.snippetData.search;
    let searchTitle = dbSnippet.snippetData.title!;
    let searchDescription = dbSnippet.snippetData.description;
    let searchSynonyms: string[] | undefined = undefined;
    if (snippetSearch) {
      if (typeof snippetSearch === 'boolean') {
      } else if (typeof snippetSearch === 'string') {
        snippetSearch.trim() && (searchTitle = snippetSearch.trim());
      } else if (Array.isArray(snippetSearch)) {
        searchSynonyms = snippetSearch.length > 0 ? snippetSearch : undefined;
      } else {
        searchTitle = snippetSearch.title || searchTitle;
        searchDescription = snippetSearch.description || searchDescription;
        searchSynonyms =
          snippetSearch.synonyms && snippetSearch.synonyms.length > 0
            ? snippetSearch.synonyms
            : undefined;
      }
    }

    entryLists.get(dbSnippet.schemaName)!.entries.push({
      category: 'element:' + dbSnippet.schemaName,
      title: searchTitle,
      description: searchDescription,
      link,
      location: locationTitle,
      synonyms: searchSynonyms,
    });
  }

  return Array.from(entryLists.values());
}
