// Unfortunately, TypeScript jsx is not returning the exact type with generics.
// No matter what tag you use, it will be casted to general JSProseElement loosing all generics.
// This prevents some cool compile/editor time checkings like prohibiting certain tags in specific contexts (blocks in inliners and etc.)
// All this has to be done in runtime or with other tools, like eslint.
// @see https://github.com/microsoft/TypeScript/issues/21699
//
// Because of this issue, all children checking on editor/compile time is reduced to only 3 cases:
// 1) No children at all (Set `undefined` for `children` prop)
// 2) Only one child (Set RawSingleChild type for `children` prop)
// 3) Many children (Set RawChildren type for `children` prop)

import type { TextSchema } from './default/text';
import { isBlockElement, isInlinerElement, type JsxElement } from './element';
import { ProseError } from './error';
import { hash } from './hash';
import type {
    BlockSchemaAny,
    ElementSchemaAny,
    InlinerSchemaAny,
} from './schema';
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

export type RawSingleChild =
    | string
    | JsxElement<ElementSchemaAny>
    | ElementUnique<ElementTagAny>;

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

        const normalizedChildren: JsxElement<ElementSchemaAny>[] = [];

        for (const child of children) {
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

            // Merge adjacent text nodes
            const prev = normalizedChildren[normalizedChildren.length - 1];
            if (
                prev &&
                prev.tagName === 'text' &&
                normalizedChild.tagName === 'text'
            ) {
                const combinedData = prev.data + normalizedChild.data;
                prev.data = combinedData;
                prev.hash = hash(combinedData, 12);
            } else {
                normalizedChildren.push(normalizedChild);
            }
        }

        return normalizedChildren;
    }

    return undefined;
}

export function ensureHasChildren(
    tagName: string,
    children: NormalizedChildren,
): asserts children is [
    NonNullable<NormalizedChildren>[number],
    ...NonNullable<NormalizedChildren>,
] {
    if (!children || children.length === 0) {
        throw new ProseError(`<${tagName}> requires at least one child!`);
    }
}

export function ensureHasOneChild(
    tagName: string,
    children: NormalizedChildren,
): asserts children is [JsxElement<ElementSchemaAny>] {
    if (!children || children.length === 0) {
        throw new ProseError(`<${tagName}> requires one child!`);
    }

    if (children.length > 1) {
        throw new ProseError(
            `<${tagName}> can only have one child, but found ${children.length} children!`,
        );
    }
}

export function ensureBlockChild(
    tagName: string,
    child: JsxElement<ElementSchemaAny>,
): asserts child is JsxElement<BlockSchemaAny> {
    if (isInlinerElement(child)) {
        throw new ProseError(
            `<${tagName}> requires a block child, but found inliner <${child.tagName}>!`,
        );
    }
}

export function ensureInlinerChild(
    tagName: string,
    child: JsxElement<ElementSchemaAny>,
): asserts child is JsxElement<InlinerSchemaAny> {
    if (isBlockElement(child)) {
        throw new ProseError(
            `<${tagName}> requires an inliner child, but found block <${child.tagName}>!`,
        );
    }
}

//
//
//

function cloneNode<TSchema extends ElementSchemaAny>(
    node: JsxElement<TSchema>,
): JsxElement<TSchema> {
    return structuredClone(node);
}
