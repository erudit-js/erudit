import { ContentProseType } from './type';

export type ProseLinkType =
    | 'direct'
    | 'contentDocument'
    | 'contentElement' /* | newsPost */;

interface ProseLinkBase {
    type: ProseLinkType;
}

export interface DirectProseLink extends ProseLinkBase {
    type: 'direct';
    href: string;
}

export interface ContentDocumentProseLink extends ProseLinkBase {
    type: 'contentDocument';
    contentType: ContentProseType;
    fullContentId: string;
}

export interface ContentElementProseLink extends ProseLinkBase {
    type: 'contentElement';
    contentType: ContentProseType;
    fullContentId: string;
    isUnique: boolean;
    elementId: string;
}

export type ProseLink =
    | DirectProseLink
    | ContentDocumentProseLink
    | ContentElementProseLink;

export function stringifyProseLink(link: ProseLink): string {
    switch (link.type) {
        case 'direct':
            return ['direct', link.href].join('/');
        case 'contentDocument':
            return [
                'contentDocument',
                link.contentType,
                link.fullContentId,
            ].join('/');
        case 'contentElement':
            return [
                'contentElement',
                link.isUnique ? 'unique' : 'normal',
                link.contentType,
                link.fullContentId,
                link.elementId,
            ].join('/');
    }

    throw new Error(`Unknown link type: ${(link as any).type}`);
}

export function parseProseLink(linkStr: string): ProseLink {
    const parts = linkStr.split('/');
    const type = parts.shift() as ProseLinkType;

    switch (type) {
        case 'direct':
            return { type: 'direct', href: parts.join('/') };
        case 'contentDocument':
            return {
                type: 'contentDocument',
                contentType: parts.shift() as ContentProseType,
                fullContentId: parts.join('/'),
            };
        case 'contentElement':
            return {
                type: 'contentElement',
                isUnique: parts.shift() === 'unique',
                contentType: parts.shift() as ContentProseType,
                elementId: parts.pop()!,
                fullContentId: parts.join('/'),
            };
    }

    throw new Error(`Unknown link type: ${type}`);
}

export function proseLinksEqual(linkA: ProseLink, linkB: ProseLink): boolean {
    return stringifyProseLink(linkA) === stringifyProseLink(linkB);
}

export type ResolvedProseLinks = Record<string, string>;
