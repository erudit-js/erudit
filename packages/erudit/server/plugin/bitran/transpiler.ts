import {
    defineBitranTranspiler,
    type ElementTranspilers,
} from '@bitran-js/transpiler';

import { ERUDIT_SERVER } from '@server/global';

// Default Elements
import { aliasesName } from '@erudit-js/bitran-elements/aliases/shared';
import { aliasesTranspiler } from '@erudit-js/bitran-elements/aliases/transpiler';
import { headingName } from '@erudit-js/bitran-elements/heading/shared';
import { defineHeadingTranspiler } from '@erudit-js/bitran-elements/heading/transpiler';
import { includeName } from '@erudit-js/bitran-elements/include/shared';
import { includeTranspiler } from '@erudit-js/bitran-elements/include/transpiler';
import { linkName } from '@erudit/shared/bitran/link/shared';
import { linkTranspiler } from '@erudit/shared/bitran/link/transpiler';

export async function createBitranTranspiler() {
    const projectTranspilers = await getProjectTranspilers();

    const defaultTranspilers = {
        [aliasesName]: aliasesTranspiler,
        [includeName]: includeTranspiler,
        [headingName]: defineHeadingTranspiler({
            language: ERUDIT_SERVER.CONFIG?.language,
        }),
        [linkName]: linkTranspiler,
    };

    const bitranTranspiler = defineBitranTranspiler({
        ...projectTranspilers,
        ...defaultTranspilers,
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
