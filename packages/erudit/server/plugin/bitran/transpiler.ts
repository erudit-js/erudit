import { defineBitranTranspiler } from '@bitran-js/transpiler';

import getServerTranspilers from '#erudit/bitran/server';

export async function createBitranTranspiler() {
    const serverTranspiler = await getServerTranspilers();
    const bitranTranspiler = defineBitranTranspiler(serverTranspiler);
    return bitranTranspiler;
}
