import type { ElementTranspiler } from '@bitran-js/transpiler';

import { aliasesName } from './aliases/shared';
import { aliasesTranspiler } from './aliases/transpiler';
import { includeName } from './include/shared';
import { includeTranspiler } from './include/transpiler';
import { headingName } from './heading/shared';
import { headingTranspiler } from './heading/transpiler';
import { detailsName } from './details/shared';
import { detailsTranspiler } from './details/transpiler';
import { linkName } from './link/shared';
import { linkTranspiler } from './link/transpiler';
import { emphasisName } from './emphasis/shared';
import { emphasisTranspiler } from './emphasis/transpiler';
import { listName } from './list/shared';
import { listTranspiler } from './list/transpiler';

export const eruditDefaultTranspilers: Record<string, ElementTranspiler> = {
    [aliasesName]: aliasesTranspiler,
    [includeName]: includeTranspiler,
    [headingName]: headingTranspiler,
    [detailsName]: detailsTranspiler,
    [linkName]: linkTranspiler,
    [emphasisName]: emphasisTranspiler,
    [listName]: listTranspiler,
};
