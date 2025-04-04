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
import type { EruditBitranElements } from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';
import getBitranElements from '#erudit/bitran/app';

let elements!: EruditBitranElements;
let transpilers!: ElementTranspilers;
let renderers!: ElementVueRenderers;

let bitranTranspiler!: BitranTranspiler;
let bitranRenderers!: ElementVueRenderers;

//
//
//

async function getElements() {
    if (!elements) elements = await getBitranElements();

    return elements;
}

async function getTranspilers() {
    if (!transpilers) {
        const elements = await getElements();
        transpilers = Object.fromEntries(
            Object.entries(elements).map(([key, item]) => [
                key,
                item.transpiler,
            ]),
        );
    }
    return transpilers;
}

async function getRenderers() {
    if (!renderers) {
        const elements = await getElements();
        renderers = Object.fromEntries(
            Object.entries(elements).map(([key, item]) => [key, item.renderer]),
        );
    }
    return renderers;
}

//
// Transpiler
//

export async function useBitranTranspiler() {
    if (bitranTranspiler) return bitranTranspiler;

    bitranTranspiler = defineBitranTranspiler({
        ...(await getTranspilers()),
    });

    return bitranTranspiler;
}

//
// Renderers
//

export async function useBitranRenderers() {
    if (bitranRenderers) return bitranRenderers;

    bitranRenderers = {
        ...(await getRenderers()),
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
