import type { ContentType } from '@erudit-js/cog/schema';

export interface ContentContributor {
    contributorId: string;
    displayName?: string;
    avatar?: string;
}

export interface Contribution {
    bookId?: string;
    bookTitle?: string;
    contentType: ContentType;
    contentTitle: string;
    contentLink: string;
}

export interface PageContributor {
    contributorId: string;
    displayName?: string;
    slogan?: string;
    links?: Record<string, string>;
    avatar?: string;
    isEditor?: boolean;
    hasDescription?: boolean;
    contributions?: Contribution[];
}

export interface ContributorListItem {
    contributorId: string;
    displayName?: string;
    isEditor?: boolean;
    avatar?: string;
    contributions: number;
}
