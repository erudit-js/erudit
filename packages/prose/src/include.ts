import {
    isUnique,
    type AnySchema,
    type AnyUnique,
    type RawElement,
} from '@jsprose/core';

import type { EruditRawElement } from './rawElement.js';
import { finalizeToc } from './toc.js';

const includedKey = '__ERUDIT_included';

export function Include(props: {
    children: AnyUnique | RawElement<AnySchema>;
    toc?: true | string;
}): RawElement<AnySchema> {
    const rawElement = isUnique(props.children)
        ? props.children.rawElement
        : props.children;

    function augmentRawElement(element: EruditRawElement<AnySchema>) {
        const isRoot = element === rawElement;

        if (isRoot) {
            if (props.toc) {
                if (props.toc === true) {
                    element.toc = finalizeToc({
                        props: { toc: props.toc },
                        element,
                    } as any);
                } else {
                    element.toc = { add: true, title: props.toc };
                }
            } else {
                delete element.toc;
            }
        } else {
            delete element.toc;
        }

        delete element.snippet;
        delete element.uniqueName;

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
