import type { GenericElementSchema } from '@bitran-js/core';
import type { ElementTranspiler } from '@bitran-js/transpiler';
import type { ElementVueRenderer } from '@bitran-js/renderer-vue';

export interface BitranElement<
    T extends GenericElementSchema = GenericElementSchema,
> {
    transpiler: () => Promise<ElementTranspiler<T>>;
    renderer: () => Promise<ElementVueRenderer<T>>;
}

export type BitranElements = Record<string, BitranElement>;

export function defineBitranElement<T extends GenericElementSchema>(
    element: BitranElement<T>,
): BitranElement {
    return element as any;
}
