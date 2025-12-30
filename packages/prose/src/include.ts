import {
    isUnique,
    type AnySchema,
    type AnyUnique,
    type RawElement,
} from '@jsprose/core';

import type { EruditRawElement } from './rawElement.js';

const includedKey = '__ERUDIT_included';

export function Include(props: {
    children: AnyUnique | RawElement<AnySchema>;
}): RawElement<AnySchema> {
    const rawElement = isUnique(props.children)
        ? props.children.rawElement
        : props.children;

    function augmentRawElement(element: EruditRawElement<AnySchema>) {
        delete element.snippet;
        (element as any)[includedKey] = true;

        if (element.children) {
            for (const child of element.children) {
                augmentRawElement(child as EruditRawElement<AnySchema>);
            }
        }
    }

    augmentRawElement(rawElement as EruditRawElement<AnySchema>);

    return rawElement;
}

export function isIncludedRawElement(
    rawElement: RawElement<AnySchema>,
): boolean {
    return (rawElement as any)[includedKey] === true;
}
