// Unfortunately, TypeScript jsx is not returning the exact type with generics.
// No matter what tag you use, it will be casted to general JSProseElement loosing all generics.
// This prevents some cool compile/editor time checkings like prohibiting certain tags in specific contexts (blocks in inliners and etc.)
// All this has to be done in runtime or with other tools, like eslint.
// @see https://github.com/microsoft/TypeScript/issues/21699

import {
    _children,
    createProseElement,
    ProseElementType,
    type ProseElementAny,
} from './element';
import type { ProseText } from './default';
import { isRef, refToElement, type ProseRef } from './ref';
import { ProseError } from './error';

type ConstructRawChildren<Types extends readonly any[]> =
    | Types[number]
    | { [K in keyof Types]: Types[K][] }[number]
    | Types[number][];

export type ProseChildrenRaw =
    | ConstructRawChildren<[string, ProseElementAny, ProseRef]>
    | undefined;

export type ProseNormalizedChildren = ProseElementAny[] | undefined;

export function normalizeChildren(
    props: {
        children?: ProseChildrenRaw;
    },
    step?: (child: ProseElementAny) => void,
): ProseNormalizedChildren {
    if (props.children) {
        const children = Array.isArray(props.children)
            ? props.children
            : [props.children];

        const normalizedChildren = children.map((child) => {
            let normalizedChild: ProseElementAny;

            // Intercept strings
            if (typeof child === 'string') {
                normalizedChild = createProseElement<ProseText>({
                    type: ProseElementType.Inliner,
                    name: 'text',
                    data: child,
                    [_children]: undefined,
                });
            }
            // Intercept refs
            else if (isRef(child)) {
                const element = refToElement(child);
                if (!element) {
                    throw new ProseError(
                        `Unable to unwrap undefined JSProse reference "${child.slug}"!`,
                    );
                }
                normalizedChild = element;
            }
            // Already a ProseElement
            else {
                normalizedChild = child;
            }

            step && step(normalizedChild);

            return normalizedChild;
        });

        if (normalizedChildren.length > 0) {
            return normalizedChildren;
        }
    }

    return undefined;
}
