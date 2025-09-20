import { ProseError } from './error';
import type { ElementTagAny } from './tag';

export const ElementUniqueSymbol = Symbol('ElementUnique');

export type ElementUnique<TTag extends ElementTagAny> = {
    readonly [ElementUniqueSymbol]: undefined;
    readonly tag: TTag;
    readonly element: ReturnType<TTag> | undefined;
    readonly slug: string;
    readonly url: string;
    readonly id: string;
};

export type ElementUniqueAny = ElementUnique<ElementTagAny>;

export function defineUnique<TTag extends ElementTagAny>(definition: {
    tag: TTag;
    slug: string;
    url: string;
}) {
    let _element: ReturnType<TTag> | undefined = undefined;

    return {
        [ElementUniqueSymbol]: undefined,
        tag: definition.tag,
        slug: definition.slug,
        url: definition.url,
        get element(): ReturnType<TTag> | undefined {
            return _element;
        },
        set element(value: ReturnType<TTag>) {
            if (_element) {
                throw new ProseError(
                    `Element unique "${definition.slug}" is already assigned!`,
                );
            }

            if (!this.tag.isTagElement(value)) {
                throw new ProseError(
                    `Element unique "${definition.slug}" can only be assigned to <${definition.tag.tagName}>, but was assigned to <${(value as any)?.tagName}>!`,
                );
            }

            _element = value;
        },
        get id(): string {
            return `${definition.url} → ${definition.slug}`;
        },
    } as ElementUnique<TTag>;
}

export function isUnique<TTag extends ElementTagAny>(
    unique: any,
    tag?: TTag,
): unique is ElementUnique<TTag> {
    if (!unique || typeof unique !== 'object') {
        return false;
    }

    const hasUniqueSymbol = ElementUniqueSymbol in unique;

    if (!hasUniqueSymbol) {
        return false;
    }

    if (tag) {
        return unique?.tag?.tagName === tag.tagName;
    }

    return true;
}
