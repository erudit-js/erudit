import {
    parseContentItemId,
    stringifyContentItemId,
    type ContentItemId,
} from '../content/itemId.js';
import {
    parseDocumentId,
    stringifyDocumentId,
    type DocumentId,
} from './documentId.js';

export const proseLinkTypes = [
    'direct',
    'document',
    'unique',
    'contentItem',
] as const;

export type ProseLinkType = (typeof proseLinkTypes)[number];

export function isProseLinkType(value: unknown): value is ProseLinkType {
    return (
        typeof value === 'string' &&
        proseLinkTypes.includes(value as ProseLinkType)
    );
}

interface BaseProseLink {
    type: ProseLinkType;
}

export interface DirectProseLink extends BaseProseLink {
    type: 'direct';
    href: string;
}

export interface DocumentProseLink extends BaseProseLink {
    type: 'document';
    documentId: DocumentId;
}

export interface UniqueProseLink extends BaseProseLink {
    type: 'unique';
    documentId: DocumentId;
    uniqueName: string;
}

export interface ContentItemProseLink extends BaseProseLink {
    type: 'contentItem';
    itemId: ContentItemId;
}

export type ProseLink =
    | DirectProseLink
    | DocumentProseLink
    | UniqueProseLink
    | ContentItemProseLink;

export function stringifyProseLink(proseLink: ProseLink): string {
    switch (proseLink.type) {
        case 'direct':
            return `direct/${proseLink.href}`;
        case 'document':
            return `document/${stringifyDocumentId(proseLink.documentId)}`;
        case 'unique':
            return `unique/${stringifyDocumentId(
                proseLink.documentId,
            )}/${proseLink.uniqueName}`;
        case 'contentItem':
            return `contentItem/${stringifyContentItemId(proseLink.itemId)}`;
    }
}

export function parseProseLink(strProseLink: string): ProseLink | undefined {
    const parts = strProseLink.split('/');
    const type = parts.shift()!;

    if (!isProseLinkType(type)) {
        return undefined;
    }

    switch (type) {
        case 'direct':
            return {
                type: 'direct',
                href: parts.join('/'),
            };
        case 'document':
            return {
                type: 'document',
                documentId: parseDocumentId(parts.join('/')),
            };
        case 'unique':
            const uniqueName = parts.pop()!;
            return {
                type: 'unique',
                documentId: parseDocumentId(parts.join('/')),
                uniqueName,
            };
        case 'contentItem':
            return {
                type: 'contentItem',
                itemId: parseContentItemId(parts.join('/'))!,
            };
    }
}
