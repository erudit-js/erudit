import type { ContentFlags, ContentType } from '@erudit-js/cog/schema';

export interface FrontContentNavItemBase {
    shortId: string;
    title: string;
    link: string;
    flags: ContentFlags;
}

export interface FrontContentNavTopic extends FrontContentNavItemBase {
    type: ContentType.Topic;
}

export interface FrontContentNavPage extends FrontContentNavItemBase {
    type: ContentType.Page;
}

export interface FrontContentNavGroup extends FrontContentNavItemBase {
    type: ContentType.Group;
    separator: boolean;
    children: FrontContentNavItem[];
}

export interface FrontContentNavBook extends FrontContentNavItemBase {
    type: ContentType.Book;
    children: FrontContentNavItem[];
}

export type FrontContentNavItem =
    | FrontContentNavTopic
    | FrontContentNavPage
    | FrontContentNavGroup
    | FrontContentNavBook;

export type FrontGlobalContentNav = {
    bookShortIds: string[];
    frontNavItems: FrontContentNavItem[];
};
