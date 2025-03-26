import {
    createPhraseCaller,
    getDefaultRenderers as getDefaultBitranRenderers,
    getElementIcon,
    type ElementVueRenderers,
} from '@bitran-js/renderer-vue';
import {
    defineBitranTranspiler,
    type BitranTranspiler,
} from '@bitran-js/transpiler';
import { eruditDefaultTranspilers } from '@erudit-js/bitran-elements/defaultTranspilers';
import { eruditDefaultRenderers } from '@erudit-js/bitran-elements/defaultRenderers';

import eruditConfig from '#erudit/config';
import projectBitranTranspilers from '#erudit/bitran/transpilers';
import projectBitranRenderers from '#erudit/bitran/renderers';

let bitranTranspiler!: BitranTranspiler;
let bitranRenderers!: ElementVueRenderers;

globalThis.useEruditConfig = () => eruditConfig;

//
// Transpiler
//

export async function useBitranTranspiler() {
    if (bitranTranspiler) return bitranTranspiler;

    bitranTranspiler = defineBitranTranspiler({
        ...projectBitranTranspilers,
        ...eruditDefaultTranspilers,
    });

    return bitranTranspiler;
}

//
// Renderers
//

export async function useBitranRenderers() {
    if (bitranRenderers) return bitranRenderers;

    bitranRenderers = {
        ...projectBitranRenderers,
        ...eruditDefaultRenderers,
    };

    return bitranRenderers!;
}

//
// Utils
//

export async function useBitranElementRenderer(productName: string) {
    const renderer =
        (await useBitranRenderers())[productName] ||
        getDefaultBitranRenderers()[productName];

    if (!renderer)
        throw new Error(`Missing Bitran product render "${productName}"!`);

    return renderer;
}

export async function useBitranElementIcon(productName: string) {
    const renderer = await useBitranElementRenderer(productName);
    return await getElementIcon(renderer);
}

export async function useBitranElementLanguage(productName: string) {
    const renderer = await useBitranElementRenderer(productName);
    return await createPhraseCaller(renderer, eruditConfig?.language || 'en');
}
