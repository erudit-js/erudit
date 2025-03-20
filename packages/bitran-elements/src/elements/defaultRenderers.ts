import type { ElementVueRenderer } from '@bitran-js/renderer-vue';

import { aliasesName } from './aliases/shared';
import { aliasesRenderer } from './aliases/renderer';
import { includeName } from './include/shared';
import { includeRenderer } from './include/renderer';
import { headingName } from './heading/shared';
import { headingRenderer } from './heading/renderer';
import { detailsName } from './details/shared';
import { detailsRenderer } from './details/renderer';
import { linkName } from './link/shared';
import { linkRenderer } from './link/renderer';
import { emphasisName } from './emphasis/shared';
import { emphasisRenderer } from './emphasis/renderer';
import { listName } from './list/shared';
import { listRenderer } from './list/renderer';

export const eruditDefaultRenderers: Record<string, ElementVueRenderer> = {
    [aliasesName]: aliasesRenderer,
    [includeName]: includeRenderer,
    [headingName]: headingRenderer,
    [detailsName]: detailsRenderer,
    [linkName]: linkRenderer as any,
    [emphasisName]: emphasisRenderer,
    [listName]: listRenderer,
};
