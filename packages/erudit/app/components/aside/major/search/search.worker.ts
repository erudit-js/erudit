import { Document, Encoder } from 'flexsearch';

import { encoderAugments } from '@erudit/shared/search/encoders';
import { unzip } from '@erudit/shared/utils/zip';

const batchSize = 50;

let fullSiteUrl: string;
let initPromise: Promise<void>;
let initError: string | undefined;
let latestSearchId: number = -1;
let documentIndex: Document;
let categoryPriorityById: Record<string, number>;

let currentOrdered: (string | number)[] = [];
let currentOffset = 0;

onmessage = async (e) => {
    const command = e.data as SearchCommand;
    switch (command.type) {
        case 'init':
            fullSiteUrl = command.fullSiteUrl;
            initPromise = init(command);
            break;
        case 'search': {
            await initPromise;
            trySendInitError();
            latestSearchId = command.id;
            currentOrdered = buildOrderedResults(command.query);
            currentOffset = 0;
            sendResults(command.id, batchSize);
            break;
        }
        case 'more': {
            await initPromise;
            trySendInitError();
            sendResults(command.id, batchSize);
            break;
        }
    }
};

async function init(initCommand: SearchCommandInit) {
    try {
        const fetchedSearch = await fetch(
            fullSiteUrl + 'search.json.gz?' + initCommand.cacheId,
        );
        const gzipSearch = await fetchedSearch.text();
        const textSearch = await unzip(gzipSearch);
        const jsonSearch = JSON.parse(textSearch);

        const encoder = new Encoder();
        encoderAugments[initCommand.language as LanguageCode]?.(encoder);

        documentIndex = new Document({
            document: {
                ...jsonSearch.documentDescriptor,
                encoder,
            },
        });

        categoryPriorityById = Object.create(null);
        for (const cat of jsonSearch.categories as {
            id: string;
            priority: number;
        }[]) {
            categoryPriorityById[cat.id] = cat.priority;
        }

        for (const key in jsonSearch.export) {
            documentIndex.import(key, jsonSearch.export[key]);
        }
    } catch (error) {
        initError =
            'Search init error: ' +
            (error instanceof Error ? error.message : String(error));

        const errorResponse: SearchResponseError = {
            type: 'error',
            message: initError,
        };

        postMessage(errorResponse);
    }
}

function trySendInitError() {
    if (initError) {
        const errorResponse: SearchResponseError = {
            type: 'error',
            message: initError,
        };
        postMessage(errorResponse);
    }
}

function buildOrderedResults(query: string): (string | number)[] {
    // 1. Fast-path: ignore empty or whitespace-only queries.
    if (!query || !query.trim()) return [];

    // 2. Perform search. FlexSearch Document#search returns groups (by field/tag).
    //    Each group contains a .result array of ids. We set a reasonably high limit
    //    (1000) to gather enough candidates; final pagination happens later.
    const groups = documentIndex.search(query, { limit: 1000 }) as {
        field?: string;
        tag?: string;
        result: (string | number)[];
    }[];

    // 3. Use a Set to enforce uniqueness while preserving first-seen order.
    const seen = new Set<string | number>();

    // 4. Accumulate ranked entries immediately (single pass):
    //    - id: document identifier
    //    - priority: derived from document metadata (categoryPriority) or 0
    //    - pos: stable position (the order we first encountered the id)
    const ranked: { id: string | number; priority: number; pos: number }[] = [];
    let pos = 0;

    for (const group of groups) {
        const results = group.result;
        for (let i = 0, len = results.length; i < len; i++) {
            const id = results[i]!;
            if (!seen.has(id)) {
                seen.add(id);
                const doc: any = documentIndex.get(id);
                if (!doc) continue;
                ranked.push({
                    id,
                    priority: categoryPriorityById[doc?.category] ?? 0, // replaced doc.categoryPriority
                    pos: pos++, // capture discovery order for stable secondary sorting
                });
            }
        }
    }

    // 5. Sort primarily by descending priority, secondarily by original discovery order
    //    to preserve stable ordering among equally prioritized documents.
    ranked.sort((a, b) => b.priority - a.priority || a.pos - b.pos);

    // 6. Return only the ordered ids (actual documents fetched lazily during pagination).
    return ranked.map((r) => r.id);
}

function sendResults(searchId: number, pageSize: number) {
    if (searchId !== latestSearchId) {
        // Drop results for any stale (outdated) search id.
        return;
    }

    const start = currentOffset;
    const end = start + pageSize;
    const slice = currentOrdered.slice(start, end);
    currentOffset = end;
    const entries = slice.map((id) => documentIndex.get(id));
    const hasMore = currentOffset < currentOrdered.length;
    const resultsResponse: SearchResponseResults = {
        type: 'results',
        entries: entries as any,
        hasMore,
    };

    postMessage(resultsResponse);
}
