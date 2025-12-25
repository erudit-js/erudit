import type { ContentPointer } from '../content/pointer.js';

export const proseLinkTypes = [
    'direct',
    'contentItem',
    'unique',
    // 'anonymousUnique' TODO! Passing anonymous uniques directly to the <A> tag
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

export interface ContentItemProseLink extends BaseProseLink {
    type: 'contentItem';
    contentPointer: ContentPointer;
}

export interface UniqueProseLink extends BaseProseLink {
    type: 'unique';
    contentPointer: ContentPointer;
    uniqueName: string;
}

export type ProseLink =
    | DirectProseLink
    | ContentItemProseLink
    | UniqueProseLink;

//
//
//

declare const globalLinkBrand: unique symbol;

/**
 * Use only on type level to typeguard allowed values (for example, the "to" prop of <A> and <BlockLink> tags).
 */
export interface GlobalLinkTypeguard {
    [globalLinkBrand]: true;
}

export interface GlobalLink {
    __link: string;
}
