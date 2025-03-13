import {
    defineBitranTranspiler,
    type ElementTranspilers,
} from '@bitran-js/transpiler';

import { ERUDIT_SERVER } from '@server/global';

export async function createBitranTranspiler() {
    const projectTranspilers = await getProjectTranspilers();
    const defaultTranspilers = await getDefaultTranspilers();

    const bitranTranspiler = defineBitranTranspiler({
        ...projectTranspilers,
        ...defaultTranspilers,
    });

    return bitranTranspiler;
}

async function getDefaultTranspilers(): Promise<ElementTranspilers> {
    const getDefaultElements = (
        await import('@erudit-js/bitran-elements/default')
    ).eruditDefaultElements;

    const defaultElements = getDefaultElements();
    const defaultTranspilers: ElementTranspilers = {};

    for (const [name, bitranElement] of Object.entries(defaultElements))
        defaultTranspilers[name] = await bitranElement.transpiler();

    return defaultTranspilers;
}

async function getProjectTranspilers(): Promise<ElementTranspilers> {
    const bitranElements = ERUDIT_SERVER?.BITRAN_CONFIG?.elements;

    if (!bitranElements) return {};

    const projectTranspilers: ElementTranspilers = {};
    for (const [name, bitranElement] of Object.entries(bitranElements))
        projectTranspilers[name] = await bitranElement.transpiler();

    return projectTranspilers;
}
