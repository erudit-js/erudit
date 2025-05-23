import type { ElementTranspilers } from '@bitran-js/transpiler';

import { aliasesName } from './elements/aliases/shared';
import { aliasesTranspiler } from './elements/aliases/transpiler';
import { includeName } from './elements/include/shared';
import { includeTranspiler } from './elements/include/transpiler';
import { headingName } from './elements/heading/shared';
import { headingTranspiler } from './elements/heading/transpiler';
import { detailsName } from './elements/details/shared';
import { detailsTranspiler } from './elements/details/transpiler';
import { linkName } from './elements/link/shared';
import { linkServerTranspiler } from './elements/link/server';
import { emphasisName } from './elements/emphasis/shared';
import { emphasisTranspiler } from './elements/emphasis/transpiler';
import { listName } from './elements/list/shared';
import { listTranspiler } from './elements/list/transpiler';
import { imageName } from './elements/image/shared';
import { imageServerTranspiler } from './elements/image/server';
import { galleryName } from './elements/gallery/shared';
import { galleryServerTranspiler } from './elements/gallery/server';
import { tableName } from './elements/table/shared';
import { tableTranspiler } from './elements/table/transpiler';
import { videoName } from './elements/video/shared';
import { videoServerTranspiler } from './elements/video/server';
import { flexName } from './elements/flex/shared';
import { flexTranspiler } from './elements/flex/transpiler';
import { problemName, problemsName } from './elements/problem/shared';
import {
    problemServerTranspiler,
    problemsServerTranspiler,
} from './elements/problem/server';
import { hrName } from './elements/hr/shared';
import { hrTranspiler } from './elements/hr/transpiler';
import { todoName } from './elements/todo/shared';
import { todoTranspiler } from './elements/todo/transpiler';

export const eruditTranspilers: ElementTranspilers = {
    [aliasesName]: aliasesTranspiler,
    [includeName]: includeTranspiler,
    [headingName]: headingTranspiler,
    [detailsName]: detailsTranspiler,
    [linkName]: linkServerTranspiler,
    [emphasisName]: emphasisTranspiler,
    [listName]: listTranspiler,
    [imageName]: imageServerTranspiler,
    [galleryName]: galleryServerTranspiler,
    [tableName]: tableTranspiler,
    [videoName]: videoServerTranspiler,
    [flexName]: flexTranspiler,
    [problemName]: problemServerTranspiler,
    [problemsName]: problemsServerTranspiler,
    [hrName]: hrTranspiler,
    [todoName]: todoTranspiler,
};
