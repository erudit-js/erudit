import type { ElementTranspilers } from '@bitran-js/transpiler';
import type { ElementVueRenderers } from '@bitran-js/renderer-vue';

export function defineBitranTranspilers(
    transpilers: ElementTranspilers,
): ElementTranspilers {
    return transpilers;
}

export function defineBitranRenderers(
    renderers: ElementVueRenderers,
): ElementVueRenderers {
    return renderers;
}
