import { isTopicPart } from '@erudit-js/cog/schema';
import { tryReplaceAlias } from '@erudit-js/bitran-elements/aliases/shared';

import type { BitranContext } from '@shared/bitran/context';
import {
    bitranLocationTypes,
    parsePartialBitranLocation,
    stringifyBitranLocation,
} from '@shared/bitran/location';

export type LinkTargetType = 'unique' | 'page' | 'absolute' | 'external';

interface LinkTargetBase {
    type: LinkTargetType;
}

export interface UniqueLinkTarget extends LinkTargetBase {
    type: 'unique';
    strlocation: string;
    _productName?: string;
    _absoluteStrLocation?: string;
    _href?: string;
}

export const linkTargetPageTypes = {
    ...bitranLocationTypes,
    // Custom page types, that does not have Bitran content
    book: true,
};

export type LinkTargetPageType = keyof typeof linkTargetPageTypes;

export function isLinkTargetPageType(
    pageType: any,
): pageType is LinkTargetPageType {
    return pageType in linkTargetPageTypes;
}

function pageTypeRequiresPath(type: LinkTargetPageType) {
    return linkTargetPageTypes[type];
}

export interface PageLinkTarget extends LinkTargetBase {
    type: 'page';
    pageType: LinkTargetPageType;
    path?: string;
    _href?: string;
}

export interface AbsoluteLinkTarget extends LinkTargetBase {
    type: 'absolute';
    href: string;
}

export interface ExternalLinkTarget extends LinkTargetBase {
    type: 'external';
    href: string;
}

export type LinkTarget =
    | UniqueLinkTarget
    | PageLinkTarget
    | AbsoluteLinkTarget
    | ExternalLinkTarget;

export function createLinkTarget(
    target: string,
    context: BitranContext,
): LinkTarget {
    target = tryReplaceAlias(target, context.aliases);

    if (target.startsWith('/'))
        return {
            type: 'absolute',
            href: target,
        };

    try {
        new URL(target);
        return {
            type: 'external',
            href: target,
        };
    } catch {}

    if (target.startsWith('page|')) {
        let [, pageType, path] = target.split('|');

        if (!isLinkTargetPageType(pageType))
            throw new Error(
                `Unknown page type "${pageType}" in link "${target}"!`,
            );

        if (!path) {
            if (isTopicPart(pageType)) {
                if (!isTopicPart(context.location.type))
                    throw new Error(
                        `Page link "${target}" is referencing topic part "${pageType}" without path in non-topic context!`,
                    );

                path = context.location.path;
            } else {
                if (pageTypeRequiresPath(pageType))
                    throw new Error(
                        `Page link "${target}" does not have a path!`,
                    );
            }
        }

        return {
            type: 'page',
            pageType,
            path,
        };
    }

    const location = parsePartialBitranLocation(target, context.location);

    if (
        !location.unique &&
        isLinkTargetPageType(location.type) &&
        !isTopicPart(location.type)
    )
        return {
            type: 'page',
            pageType: location.type,
            path: location.path,
        };

    return {
        type: 'unique',
        strlocation: stringifyBitranLocation(location),
    };
}
