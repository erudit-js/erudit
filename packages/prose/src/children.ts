// Unfortunately, TypeScript jsx is not returning the exact type with generics.
// No matter what tag you use, it will be casted to general JSProseElement loosing all generics.
// This prevents some cool compile/editor time checkings like prohibiting certain tags in specific contexts (blocks in inliners and etc.)
// All this has to be done in runtime or with other tools, like eslint.
// @see https://github.com/microsoft/TypeScript/issues/21699

import type { TextSchema } from './default/text';
import type { JsxElement } from './element';
import { ProseError } from './error';
import { hash } from './hash';
import type { ElementSchemaAny } from './schema';
import type { ElementTagAny } from './tag';
import { ElementType } from './type';
import { isUnique, type ElementUnique } from './unique';

type ConstructRawChildren<Types extends readonly any[]> =
    | Types[number]
    | { [K in keyof Types]: Types[K][] }[number]
    | Types[number][];

export type RawChildren =
    | ConstructRawChildren<
          [string, JsxElement<ElementSchemaAny>, ElementUnique<ElementTagAny>]
      >
    | undefined;

export type NormalizedChildren = JsxElement<ElementSchemaAny>[] | undefined;

export function normalizeChildren(
    props: {
        children?: RawChildren;
    },
    step?: (child: JsxElement<ElementSchemaAny>) => void,
): NormalizedChildren {
    if (props.children) {
        const children = Array.isArray(props.children)
            ? props.children
            : [props.children];

        const normalizedChildren = children.map((child) => {
            let normalizedChild: JsxElement<ElementSchemaAny>;

            // Intercept strings
            if (typeof child === 'string') {
                normalizedChild = <JsxElement<TextSchema>>{
                    type: ElementType.Inliner,
                    name: 'text',
                    tagName: 'text',
                    hash: hash(child, 12),
                    data: child,
                };
            }
            // Intercept uniques
            else if (isUnique(child)) {
                const element = child.element;
                if (!element) {
                    throw new ProseError(
                        `Unable to unwrap undefined unique "${child.slug}"!`,
                    );
                }
                normalizedChild = cloneNode(element as any);
            }
            // Already a NodeElement
            else {
                normalizedChild = cloneNode(child);
            }

            step?.(normalizedChild);

            return normalizedChild;
        });

        if (normalizedChildren.length > 0) {
            return normalizedChildren;
        }
    }

    return undefined;
}

function cloneNode<TSchema extends ElementSchemaAny>(
    node: JsxElement<TSchema>,
): JsxElement<TSchema> {
    return structuredClone(node);
}
