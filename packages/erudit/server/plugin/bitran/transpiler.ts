import {
    defineBitranTranspiler,
    type ElementTranspilers,
} from '@bitran-js/transpiler';
import { eruditDefaultTranspilers } from '@erudit-js/bitran-elements/defaultTranspilers';

import { ERUDIT_SERVER } from '@server/global';

export async function createBitranTranspiler() {
    const projectTranspilers = await getProjectTranspilers();

    const bitranTranspiler = defineBitranTranspiler({
        ...projectTranspilers,
        ...eruditDefaultTranspilers,
    });

    return bitranTranspiler;
}

async function getProjectTranspilers(): Promise<ElementTranspilers> {
    const bitranElements = ERUDIT_SERVER?.BITRAN_CONFIG?.elements;

    if (!bitranElements) return {};

    const projectTranspilers: ElementTranspilers = {};
    for (const [name, bitranElement] of Object.entries(bitranElements))
        projectTranspilers[name] = await bitranElement.transpiler();

    return projectTranspilers;
}
