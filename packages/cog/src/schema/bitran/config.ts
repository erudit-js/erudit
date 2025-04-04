import type { GenericElementSchema } from '@bitran-js/core';
import type { ElementVueRenderer } from '@bitran-js/renderer-vue';
import type {
    ElementTranspiler,
    ElementTranspilers,
} from '@bitran-js/transpiler';

//
// Server
//

export function defineServerBitran(
    getTranspilers: () => Promise<ElementTranspilers>,
) {
    return getTranspilers;
}

//
// App
//

export interface EruditBitranElement<
    T extends GenericElementSchema = GenericElementSchema,
> {
    transpiler: ElementTranspiler<T>;
    renderer: ElementVueRenderer<T>;
}

export type EruditBitranElements = Record<string, EruditBitranElement>;

export function defineAppBitran(
    getElements: () => Promise<EruditBitranElements>,
) {
    return getElements;
}
