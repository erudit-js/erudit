import type { GenericElementSchema } from '@bitran-js/core';
import type { ElementTranspiler } from '@bitran-js/transpiler';
import type { ElementVueRenderer } from '@bitran-js/renderer-vue';

export interface BitranElementConfig<
    T extends GenericElementSchema = GenericElementSchema,
> {
    transpiler: () => Promise<ElementTranspiler<T>>;
    renderer: () => Promise<ElementVueRenderer<T>>;
}

export type BitranElements = Record<string, BitranElementConfig>;

export interface EruditBitranConfig<
    TElements extends BitranElements = BitranElements,
> {
    elements: TElements;
    toc: (keyof TElements)[];

    /**
     * TODO!
     * Groups of elements that are tracked on site, included in TOC, in search, display in front and book pages and so on.
     *
     * Example:
     * tracked: {
     *     term: {
     *        elements: ['definition', 'axiom'],
              title: 'Термин',
              toc: true,
              search: false,
              color: '#E0E0E0',
     *     }
     * }
     */
}

export function defineBitranConfig<T extends BitranElements>(
    config: Partial<EruditBitranConfig<T>>,
) {
    return config;
}

export function defineBitranElement<T extends GenericElementSchema>(
    config: BitranElementConfig<T>,
) {
    return config;
}
