import { defineBitranTranspiler } from '@bitran-js/transpiler';
import {
    setEruditBitranRuntime,
    type EruditBitranRuntime,
} from '@erudit-js/cog/schema';

import getServerTranspilers from '#erudit/bitran/server';

export async function createBitranTranspiler(runtime: EruditBitranRuntime) {
    const serverTranspiler = await getServerTranspilers();
    const bitranTranspiler = defineBitranTranspiler(serverTranspiler);

    [bitranTranspiler.parser, bitranTranspiler.stringifier].forEach((item) => {
        setEruditBitranRuntime(item, runtime);
    });

    return bitranTranspiler;
}
