import type { ProseElementAny } from './element';
import { ProseError } from './error';
import { isTagElement, type ProseTag } from './tag';

export const ProseRefSymbol = Symbol('ProseRef');

export type ProseRef<TElement extends ProseElementAny = ProseElementAny> = {
    readonly [ProseRefSymbol]: undefined;
    readonly tag: ProseTag<TElement>;
    readonly slug: string;
    readonly url: string;
    readonly element: TElement | undefined;
};

export type TagsToRefs<TTags extends Record<string, ProseTag>> = {
    [K in keyof TTags]: ProseRef<ReturnType<TTags[K]>>;
};

export function defineRef<TElement extends ProseElementAny>(definition: {
    tag: ProseTag<TElement>;
    slug: string;
    url: string;
}) {
    let _element: TElement | undefined = undefined;

    return {
        [ProseRefSymbol]: undefined,
        tag: definition.tag,
        slug: definition.slug,
        url: definition.url,
        get element(): TElement | undefined {
            return _element;
        },
        set element(value: TElement) {
            if (_element) {
                throw new ProseError(
                    `Prose reference "${definition.slug}" is already assigned!`,
                );
            }

            if (!isTagElement(value, definition.tag)) {
                throw new ProseError(
                    `Prose reference "${definition.slug}" can only be assigned to <${definition.tag.name}> tags!`,
                );
            }

            _element = value;
        },
    } as ProseRef<TElement>;
}

export function isRef<TElement extends ProseElementAny>(
    ref: any,
    tag?: ProseTag<TElement>,
): ref is ProseRef<TElement> {
    if (!ref || typeof ref !== 'object') {
        return false;
    }

    const hasRefSymbol = ProseRefSymbol in ref;

    if (!hasRefSymbol) {
        return false;
    }

    if (tag) {
        return ref?.tag?.name === tag.name;
    }

    return true;
}

export function refToElement<TElement extends ProseElementAny>(
    ref: ProseRef<TElement>,
): TElement | undefined {
    return ref.element;
}
