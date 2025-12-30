import {
    ensureTagChild,
    ProseError,
    textSchema,
    type AnyUnique,
    type NormalizedChildren,
} from '@jsprose/core';
import type { GlobalContentTypeguard } from '@erudit-js/core/content/global';

import type { EruditRawElement } from '../../rawElement.js';
import type { depSchema, dependencySchema } from './dependency/core.js';
import { createLinkStorageKey } from './storage.js';
import type { referenceSchema, refSchema } from './reference/core.js';

export interface LinkData {
    label: string;
    storageKey?: string;
}

export type LinkToProp = string | GlobalContentTypeguard | AnyUnique;

export function handleLinkTag(
    element: EruditRawElement<
        | typeof depSchema
        | typeof dependencySchema
        | typeof refSchema
        | typeof referenceSchema
    >,
    tagName: string,
    props: { to: LinkToProp },
    children: NormalizedChildren,
) {
    ensureTagChild(tagName, children, [textSchema]);
    const child = children[0];
    const label = child.data.trim();

    if (!label) {
        throw new ProseError(`<${tagName}> label cannot be empty!`);
    }

    element.data = { label };
    element.storageKey = createLinkStorageKey(props.to, tagName);
}
