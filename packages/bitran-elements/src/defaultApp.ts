import type { EruditBitranElements } from '@erudit-js/cog/schema';

import { aliasesName } from './elements/aliases/shared';
import { aliasesTranspiler } from './elements/aliases/transpiler';
import { aliasesRenderer } from './elements/aliases/renderer';
import { includeName } from './elements/include/shared';
import { includeTranspiler } from './elements/include/transpiler';
import { includeRenderer } from './elements/include/renderer';
import { headingName } from './elements/heading/shared';
import { headingTranspiler } from './elements/heading/transpiler';
import { headingRenderer } from './elements/heading/renderer';
import { detailsName } from './elements/details/shared';
import { detailsTranspiler } from './elements/details/transpiler';
import { detailsRenderer } from './elements/details/renderer';
import { linkName } from './elements/link/shared';
import { linkTranspiler } from './elements/link/transpiler';
import { linkRenderer } from './elements/link/renderer';
import { emphasisName } from './elements/emphasis/shared';
import { emphasisTranspiler } from './elements/emphasis/transpiler';
import { emphasisRenderer } from './elements/emphasis/renderer';
import { listName } from './elements/list/shared';
import { listTranspiler } from './elements/list/transpiler';
import { listRenderer } from './elements/list/renderer';
import { imageName } from './elements/image/shared';
import { imageTranspiler } from './elements/image/transpiler';
import { imageRenderer } from './elements/image/renderer';
import { galleryName } from './elements/gallery/shared';
import { galleryTranspiler } from './elements/gallery/transpiler';
import { galleryRenderer } from './elements/gallery/renderer';

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
    [galleryName]: {
        transpiler: galleryTranspiler,
        renderer: galleryRenderer,
    },
};
