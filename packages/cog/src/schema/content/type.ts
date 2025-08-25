export enum ContentType {
    Book = 'book',
    Group = 'group',
    Page = 'page',
    Topic = 'topic',
}

export function isContentType(type: any): type is ContentType {
    return Object.values(ContentType).includes(type);
}

// export const contentTypes = ['book', 'group', 'topic'] as const;
// export const topicParts = ['article', 'summary', 'practice'] as const;
// export const contentFlags = ['dev', 'advanced', 'secondary'] as const;

// export type ContentType = (typeof contentTypes)[number];
// export type TopicPart = (typeof topicParts)[number];
// export type ContentFlag = (typeof contentFlags)[number];

// export function isTopicPart(topicPart: any): topicPart is TopicPart {
//     return topicParts.includes(topicPart);
// }

// export function isContentType(type: any): type is ContentType {
//     return contentTypes.includes(type) || isTopicPart(type);
// }

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
