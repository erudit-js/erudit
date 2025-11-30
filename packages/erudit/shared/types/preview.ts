import type { ContentProseType } from '@erudit-js/core/content/prose';
import type { AnySchema, ProseElement } from '@jsprose/core';

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
    contentProseType?: ContentProseType;
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
    contentProseType: ContentProseType;
    title: string;
    description?: string;
    bookTitle?: string;
    link: string;
};

export type PreviewContentUnique = {
    href: string;
    documentTitle: string;
    fadeOverlay?: boolean;
    toRenderElement?: ProseElement<AnySchema>;
} & ResolvedProse;
