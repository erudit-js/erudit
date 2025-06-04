import * as erudit from './erudit';
import * as contributor from './contributor';
import * as bitran from './bitran';
import * as content from './content';
import * as cameo from './cameo';
import * as sponsor from './sponsor';

import * as asset from '@shared/asset';

export function registerGlobals() {
    for (const [key, value] of Object.entries({
        ...erudit,
        ...contributor,
        ...bitran,
        ...content,
        ...asset,
        ...cameo,
        ...sponsor,
    })) {
        // @ts-ignore
        globalThis[key] = value;
    }
}
