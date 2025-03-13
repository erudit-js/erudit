import type { BitranLocation } from '@erudit-js/cog/schema';

import type { Toc } from '../bitran/toc';
import type { PreviousNextItem } from '../content/previousNext';
import type { ContentContributor } from '../contributor';

interface AsideMinorBase {
    type: AsideMinorType;
}

export type AsideMinorType =
    | 'topic'
    | 'group'
    | 'book'
    | 'contributor'
    | 'news';

export interface AsideMinorTopic extends AsideMinorBase {
    type: 'topic';
    fullContentId: string;
    location: BitranLocation;
    nav: Partial<{
        previous: PreviousNextItem;
        next: PreviousNextItem;
        article: string;
        summary: string;
        practice: string;
    }>;
    toc: Toc;
    contributors?: ContentContributor[];
    // todos: TodoItem[];
}

export interface AsideMinorContent extends AsideMinorBase {
    type: 'group' | 'book';
    fullContentId: string;
    nav: Partial<{
        previous: PreviousNextItem;
        next: PreviousNextItem;
    }>;
    contributors?: ContentContributor[];
}

export interface AsideMinorNews extends AsideMinorBase {
    type: 'news';
}

export type AsideMinorData =
    | AsideMinorTopic
    | AsideMinorContent
    | AsideMinorNews;
