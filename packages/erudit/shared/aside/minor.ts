import type { ContentType, TopicPart } from '@erudit-js/cog/schema';

import type { Toc } from '@shared/bitran/toc';
import type { PreviousNext } from '@shared/content/previousNext';
import type { ContentContributor } from '@shared/contributor';

export type AsideMinorType = ContentType | 'contributor' | 'news';

interface AsideMinorBase {
    type: AsideMinorType;
}

export interface AsideMinorContentBase extends AsideMinorBase {
    type: ContentType;
    fullContentId: string;
    shortContentId: string;
    fsContentDirectory: string;
    previousNext: PreviousNext;
    contributors?: ContentContributor[];
}

export interface AsideMinorBook extends AsideMinorContentBase {
    type: 'book';
}

export interface AsideMinorGroup extends AsideMinorContentBase {
    type: 'group';
}

export interface AsideMinorTopic extends AsideMinorContentBase {
    type: 'topic';
    toc: Toc;
    part: TopicPart;
    partLinks: Partial<{
        article: string;
        summary: string;
        practice: string;
    }>;
}

export interface AsideMinorNews extends AsideMinorBase {
    type: 'news';
}

export type AsideMinorData =
    | AsideMinorBook
    | AsideMinorGroup
    | AsideMinorTopic
    | AsideMinorNews;
