import { defineBitranTranspiler } from '@bitran-js/transpiler';
import { eruditDefaultTranspilers } from '@erudit-js/bitran-elements/defaultTranspilers';

import projectBitranTranspilers from '#erudit/bitran/transpilers';

export async function createBitranTranspiler() {
    const bitranTranspiler = defineBitranTranspiler({
        ...projectBitranTranspilers,
        ...eruditDefaultTranspilers,
    });

    return bitranTranspiler;
}
