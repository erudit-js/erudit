import {
    createPhraseCaller,
    getDefaultRenderers as getDefaultBitranRenderers,
    getElementIcon,
    type ElementVueRenderers,
} from '@bitran-js/renderer-vue';
import {
    defineBitranTranspiler,
    type BitranTranspiler,
    type ElementTranspilers,
} from '@bitran-js/transpiler';
import { eruditDefaultTranspilers } from '@erudit-js/bitran-elements/defaultTranspilers';
import { eruditDefaultRenderers } from '@erudit-js/bitran-elements/defaultRenderers';

import eruditConfig from '#erudit/config';
import bitranConfig from '#erudit/client/bitran';

let bitranTranspiler!: BitranTranspiler;
let bitranRenderers!: ElementVueRenderers;

globalThis.useEruditConfig = () => eruditConfig;

//
// Transpiler
//

export async function useBitranTranspiler() {
    if (bitranTranspiler) return bitranTranspiler;

    const projectTranspilers = await getProjectTranspilers();

    bitranTranspiler = defineBitranTranspiler({
        ...projectTranspilers,
        ...eruditDefaultTranspilers,
    });

    return bitranTranspiler;
}

async function getProjectTranspilers(): Promise<ElementTranspilers> {
    const bitranElements = bitranConfig.elements;

    if (!bitranElements) return {};

    const projectTranspilers: ElementTranspilers = {};
    for (const [name, bitranElement] of Object.entries(bitranElements))
        projectTranspilers[name] = await bitranElement.transpiler();

    return projectTranspilers;
}

//
// Renderers
//

export async function useBitranRenderers() {
    if (bitranRenderers) return bitranRenderers;

    const projectRenderers = await getProjectRenderers();

    // @ts-ignore
    bitranRenderers = {
        ...projectRenderers,
        ...eruditDefaultRenderers,
    };

    return bitranRenderers!;
}

async function getProjectRenderers() {
    const bitranElements = bitranConfig.elements;

    if (!bitranElements) return {};

    const projectRenderers: ElementVueRenderers = {};
    for (const [name, bitranElement] of Object.entries(bitranElements))
        projectRenderers[name] = await bitranElement.renderer();

    return projectRenderers;
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
