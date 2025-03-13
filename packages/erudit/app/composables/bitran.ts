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
import type { BitranElements } from '@erudit-js/cog/schema';
import { eruditDefaultElements } from '@erudit-js/bitran-elements/default';

import eruditConfig from '#erudit/config';
import bitranConfig from '#erudit/client/bitran';

let defaultElements!: BitranElements;
let bitranTranspiler!: BitranTranspiler;
let bitranRenderers!: ElementVueRenderers;

globalThis.useEruditConfig = () => eruditConfig;

export function getDefaultElements() {
    if (!defaultElements) defaultElements = eruditDefaultElements();
    return defaultElements;
}

//
// Transpiler
//

export async function useBitranTranspiler() {
    if (bitranTranspiler) return bitranTranspiler;

    const projectTranspilers = await getProjectTranspilers();
    const defaultTranspilers = await getDefaultTranspilers();

    bitranTranspiler = defineBitranTranspiler({
        ...projectTranspilers,
        ...defaultTranspilers,
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

async function getDefaultTranspilers(): Promise<ElementTranspilers> {
    const defaultElements = getDefaultElements();
    const defaultTranspilers: ElementTranspilers = {};

    for (const [name, bitranElement] of Object.entries(defaultElements))
        defaultTranspilers[name] = await bitranElement.transpiler();

    return defaultTranspilers;
}

//
// Renderers
//

export async function useBitranRenderers() {
    if (bitranRenderers) return bitranRenderers;

    const projectRenderers = await getProjectRenderers();
    const defaultRenderers = await getDefaultRenderers();

    // @ts-ignore
    bitranRenderers = {
        ...projectRenderers,
        ...defaultRenderers,
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

async function getDefaultRenderers() {
    const defaultElements = getDefaultElements();
    const defaultRenderers: ElementVueRenderers = {};

    for (const [name, bitranElement] of Object.entries(defaultElements))
        defaultRenderers[name] = await bitranElement.renderer();

    return defaultRenderers;
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
