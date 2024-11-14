import type { ContentFlag, TopicPart } from 'erudit-cog/schema';

export type FrontNavType = 'book' | 'topic' | 'separator' | 'folder';

export interface FrontNavBase {
    type: FrontNavType;
    id: string;
    fullId: string;
    label: string;
    level: number;
    flags?: Record<ContentFlag, boolean>;
}

export interface FrontNavTopic extends FrontNavBase {
    type: 'topic';
    part: TopicPart;
}

export interface FrontNavContainer extends FrontNavBase {
    children?: FrontNavItem[];
}

export interface FrontNavBook extends FrontNavContainer {
    type: 'book';
}

export interface FrontNavSeparator extends FrontNavContainer {
    type: 'separator';
}

export interface FrontNavFolder extends FrontNavContainer {
    type: 'folder';
}

export type FrontNavItem =
    | FrontNavTopic
    | FrontNavBook
    | FrontNavSeparator
    | FrontNavFolder;

export type FrontNav = FrontNavItem[];
