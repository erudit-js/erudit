//
// Commands
//

import type { MaybeMyIconName } from '#my-icons';

export interface SearchCommandInit {
    type: 'init';
    baseUrl: string;
    cacheId: string;
    language: LanguageCode;
}

export interface SearchCommandSearch {
    type: 'search';
    id: number;
    query: string;
}

export interface SearchCommandMore {
    type: 'more';
    id: number; // added: identify which search to paginate
}

export type SearchCommand =
    | SearchCommandInit
    | SearchCommandSearch
    | SearchCommandMore;

//
// Responses
//

export interface SearchResponseError {
    type: 'error';
    message: string;
}

export interface SearchResponseResults {
    type: 'results';
    entries: SearchEntry[];
    hasMore: boolean;
}

export type SearchResponse = SearchResponseError | SearchResponseResults;

//
//
//

export interface SearchStatusVariant {
    id: string;
    icon?: MaybeMyIconName;
    message?: string;
}

export interface SearchEntry {
    category: string;
    title: string;
    link: string;
    description?: string;
    synonyms?: string[];
    location?: string;
}

export type ResolvedSearchEntry = SearchEntry & {
    id: number;
    categoryPriority: number;
};

export interface SearchEntryCategory {
    id: string;
    priority: number;
}

export interface SearchEntriesList {
    category: SearchEntryCategory;
    entries: SearchEntry[];
}
