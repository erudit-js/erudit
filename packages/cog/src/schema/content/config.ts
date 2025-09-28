export const contentFlags = ['dev', 'advanced', 'secondary'] as const;
export type ContentFlag = (typeof contentFlags)[number];
export type ContentFlags = Partial<Record<ContentFlag, boolean>>;

export enum ContentType {
    Book = 'book',
    Group = 'group',
    Page = 'page',
    Topic = 'topic',
}

export function isContentType(type: any): type is ContentType {
    return Object.values(ContentType).includes(type);
}

export type ContentConfig = Partial<{
    title: string;
    navTitle: string;
    description: string;
    /**
     * Hidden content items do not appear in aside content navigation
     * but are still accessible via direct URL.
     */
    hidden: boolean;
    flags: ContentFlags;
    contributors: string[];
    dependencies: string[];
}>;

// export interface ContentSeo {
//     title: string;
//     description: string;
// }

// export interface ContentConfig {
//     title: string;
//     navTitle: string;
//     description: string;
//     hidden: boolean;
//     flags: Partial<Record<ContentFlag, boolean>>;
//     seo: Partial<ContentSeo>;
//     contributors: string[];
//     dependencies: string[];
// }
