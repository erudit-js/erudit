import {
    normalizeChildren,
    type ProseChildrenRaw,
    type ProseNormalizedChildren,
} from './children';
import {
    _children,
    createProseElement,
    ProseElementType,
    type ProseElementAny,
} from './element';
import { ProseError } from './error';
import type { ProseRef } from './ref';

export const ProseTagSymbol = Symbol('ProseTag');

export type ProseGlobalProps<
    TElement extends ProseElementAny = ProseElementAny,
> = {
    children?: ProseChildrenRaw;
    /** Make this element reusable by reference. */
    $ref?: ProseRef<TElement>;
    /** Show element in "Quick Links" section. */
    $link?: true | string | { label?: string; explain?: string };
    /** Make element searchable. */
    $search?:
        | true
        | string
        | { title?: string; description?: string; synonyms?: string[] };
};

export type ProseTag<
    TElement extends ProseElementAny = ProseElementAny,
    TProps extends ProseGlobalProps<TElement> = any,
> = ((props: TProps) => TElement) & {
    [ProseTagSymbol]: undefined;
    type: TElement['type'];
    name: TElement['name'];
};

export function defineTag<
    TElement extends ProseElementAny,
    TProps extends ProseGlobalProps<TElement> = ProseGlobalProps<TElement>,
>(definition: {
    type: TElement['type'];
    name: TElement['name'];
    createData(argObj: {
        props: TProps;
        children: ProseNormalizedChildren;
    }): TElement['data'];
    childStep?: (child: ProseElementAny) => void;
}): ProseTag<TElement, TProps> {
    const tag = (props: TProps) => {
        const normalizedChildren = normalizeChildren(props, (child) => {
            if (
                definition.type === ProseElementType.Inliner &&
                child.type === ProseElementType.Block
            ) {
                throw new ProseError(
                    `Inliner <${definition.name}> cannot have block children <${child.name}>!`,
                );
            }

            definition.childStep?.(child);
        });

        const data = definition.createData({
            props,
            children: normalizedChildren,
        });

        const element = createProseElement({
            type: definition.type,
            name: definition.name,
            data,
            [_children]: normalizedChildren,
        } as TElement);

        if (props.$ref) {
            // @ts-expect-error Bypass readonly
            props.$ref.element = element;
        }

        return element;
    };

    Object.defineProperties(tag, {
        [ProseTagSymbol]: { value: undefined },
        type: { value: definition.type },
        name: { value: definition.name },
    });

    return tag as ProseTag<TElement, TProps>;
}

export function isTag(tag: any): tag is ProseTag<any, any> {
    return tag && ProseTagSymbol in tag;
}

export function isTagElement<TElement extends ProseElementAny>(
    element: any,
    tag: ProseTag<TElement, any>,
): element is TElement {
    return element && element.type === tag.type && element.name === tag.name;
}
