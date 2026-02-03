import { Document, Encoder } from 'flexsearch';

import { zip } from '#layers/erudit/shared/utils/zip';
import { encoderAugments } from '#layers/erudit/shared/search/encoders';
import { searchIndexContributors } from '#layers/erudit/server/erudit/contributors/search';
import {
  searchIndexContentTypes,
  searchIndexSnippets,
} from '#layers/erudit/server/erudit/content/search';

export default defineEventHandler(async (event) => {
  const entryLists: SearchEntriesList[] = [
    await searchIndexContributors(),
    ...(await searchIndexContentTypes()),
    ...(await searchIndexSnippets()),
  ];

  const documentDescriptor = {
    id: 'id',
    index: ['title', 'synonyms'],
    store: [
      'id',
      'title',
      'description',
      'synonyms',
      'category',
      'link',
      'location',
    ],
  };

  const language = ERUDIT.config.public.language.current;
  const encoder = new Encoder();
  encoderAugments[language]?.(encoder);

  const index = new Document({
    document: documentDescriptor,
    tokenize: 'forward',
    encoder,
  });

  let id = 0;
  for (const { category, entries } of entryLists) {
    for (const entry of entries) {
      const doc = {
        id: ++id,
        category: category.id,
        title: entry.title,
        link: entry.link,
        description: entry.description
          ? entry.description.slice(0, 200) +
            (entry.description.length > 200 ? '...' : '')
          : '',
        synonyms: entry.synonyms ?? [],
        location: entry.location ?? '',
      };
      index.add(doc);
    }
  }

  const exported = {
    documentDescriptor,
    export: {} as Record<string, string>,
    categories: entryLists.map((l) => l.category),
  };

  index.export((key, data) => {
    exported.export[key] = data;
  });

  const gzipped = await zip(JSON.stringify(exported));

  setHeader(event, 'Content-Type', 'application/gzip');

  return gzipped;
});
