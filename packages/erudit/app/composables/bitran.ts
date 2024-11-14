import eruditConfig from '#erudit/config';
import bitranConfig from '#erudit/client/bitran';

import {
    createPhraseCaller,
    getDefaultRenderers,
    getElementIcon,
    type ElementVueRenderers,
} from '@bitran-js/renderer-vue';
import {
    defineBitranTranspiler,
    type BitranTranspiler,
    type ElementTranspilers,
} from '@bitran-js/transpiler';
import { aliasesName } from '@erudit-js/bitran-elements/aliases/shared';
import { aliasesTranspiler } from '@erudit-js/bitran-elements/aliases/transpiler';
import { headingName } from '@erudit-js/bitran-elements/heading/shared';
import { headingTranspiler } from '@erudit-js/bitran-elements/heading/transpiler';
import { includeName } from '@erudit-js/bitran-elements/include/shared';
import { includeTranspiler } from '@erudit-js/bitran-elements/include/transpiler';
import { linkName } from '@erudit/shared/bitran/link/shared';
import { linkTranspiler } from '@erudit/shared/bitran/link/transpiler';
import { aliasesRenderer } from '@erudit-js/bitran-elements/aliases/renderer';
import { headingRenderer } from '@erudit-js/bitran-elements/heading/renderer';
import { includeRenderer } from '@erudit-js/bitran-elements/include/renderer';
import { linkRenderer } from '@erudit/shared/bitran/link/renderer';

let bitranTranspiler!: BitranTranspiler;
let bitranRenderers!: ElementVueRenderers;

//
// Transpiler
//

export async function useBitranTranspiler() {
    if (bitranTranspiler) return bitranTranspiler;

    const projectTranspilers = await getProjectTranspilers();

    const defaultTranspilers = {
        [aliasesName]: aliasesTranspiler,
        [includeName]: includeTranspiler,
        [headingName]: headingTranspiler,
        [linkName]: linkTranspiler,
    };

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

//
// Renderers
//

export async function useBitranRenderers() {
    if (bitranRenderers) return bitranRenderers;

    const projectRenderers = await getProjectRenderers();

    const defaultRenderers = {
        [aliasesName]: aliasesRenderer,
        [includeName]: includeRenderer,
        [headingName]: headingRenderer,
        [linkName]: linkRenderer,
    };

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

//
// Utils
//

export async function useBitranElementRenderer(productName: string) {
    const renderer =
        (await useBitranRenderers())[productName] ||
        getDefaultRenderers()[productName];

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
