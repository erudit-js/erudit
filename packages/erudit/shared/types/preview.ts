import type { ContentType, TopicPart } from '@erudit-js/cog/schema';

export enum PreviewType {
    DirectLink = 'direct-link',
    ContentPage = 'content-page',
    Unique = 'unique',
}

//
//
//

export type PreviewRequestDirectLink = {
    type: PreviewType.DirectLink;
    href: string;
};

export type PreviewRequestContentPage = {
    type: PreviewType.ContentPage;
    shortId: string;
    typeOrPart?: ContentType | TopicPart;
};

export type PreviewRequestUnique = {
    type: PreviewType.Unique;
    uniqueId: string;
};

export type PreviewRequest =
    | PreviewRequestDirectLink
    | PreviewRequestContentPage
    | PreviewRequestUnique;

export type PreviewState = {
    opened: boolean;
    request: PreviewRequest | undefined;
    history: PreviewRequest[];
    blink: number;
};

//
//
//

export type PreviewContentPage = {
    type: ContentType;
    topicPart?: TopicPart;
    title: string;
    description?: string;
    bookTitle?: string;
    link: string;
};
