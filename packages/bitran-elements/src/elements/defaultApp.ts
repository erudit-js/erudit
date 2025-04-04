import type { EruditBitranElements } from '@erudit-js/cog/schema';

import { aliasesName } from './aliases/shared';
import { aliasesTranspiler } from './aliases/transpiler';
import { aliasesRenderer } from './aliases/renderer';
import { includeName } from './include/shared';
import { includeTranspiler } from './include/transpiler';
import { includeRenderer } from './include/renderer';
import { headingName } from './heading/shared';
import { headingTranspiler } from './heading/transpiler';
import { headingRenderer } from './heading/renderer';
import { detailsName } from './details/shared';
import { detailsTranspiler } from './details/transpiler';
import { detailsRenderer } from './details/renderer';
import { linkName } from './link/shared';
import { linkTranspiler } from './link/transpiler';
import { linkRenderer } from './link/renderer';
import { emphasisName } from './emphasis/shared';
import { emphasisTranspiler } from './emphasis/transpiler';
import { emphasisRenderer } from './emphasis/renderer';
import { listName } from './list/shared';
import { listTranspiler } from './list/transpiler';
import { listRenderer } from './list/renderer';
import { imageName } from './figures/image/shared';
import { imageTranspiler } from './figures/image/transpiler';
import { imageRenderer } from './figures/image/renderer';

export const eruditElements: EruditBitranElements = {
    [aliasesName]: {
        transpiler: aliasesTranspiler,
        renderer: aliasesRenderer,
    },
    [includeName]: {
        transpiler: includeTranspiler,
        renderer: includeRenderer,
    },
    [headingName]: {
        transpiler: headingTranspiler,
        renderer: headingRenderer,
    },
    [detailsName]: {
        transpiler: detailsTranspiler,
        renderer: detailsRenderer,
    },
    [linkName]: {
        transpiler: linkTranspiler,
        renderer: linkRenderer,
    },
    [emphasisName]: {
        transpiler: emphasisTranspiler,
        renderer: emphasisRenderer,
    },
    [listName]: {
        transpiler: listTranspiler,
        renderer: listRenderer,
    },
    [imageName]: {
        transpiler: imageTranspiler,
        renderer: imageRenderer,
    },
};
