import { gzip } from 'node:zlib';
import { Document, Encoder } from 'flexsearch';

import { encoderAugments } from '@erudit/shared/search/encoders';
import { searchIndexContributors } from '@erudit/server/contributors/search';

export default defineEventHandler(async () => {
    const entryLists: SearchEntriesList[] = [await searchIndexContributors()];

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

    const language = ERUDIT.config.public.project.language.current;
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
                description: entry.description ?? '',
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

    const gzipped = await new Promise<Buffer>((resolve, reject) => {
        gzip(JSON.stringify(exported), (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });

    return gzipped;
});
