import type { ContentType, TopicPart } from '@erudit-js/cog/schema';
import type { ElementSchemaAny, ParsedElement } from '@erudit-js/prose';
import type { BlocksSchema } from '@erudit-js/prose/default/blocks/index';

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
    fullId: string;
    typeOrPart?: ContentType | TopicPart;
};

export type PreviewRequestUnique = {
    type: PreviewType.Unique;
    contentPathUniqueSlug: string;
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

export type PreviewContentUnique = {
    href: string;
    documentTitle: string;
    headingStack?: ParsedElement<BlocksSchema>;
} & ResolvedProse;
