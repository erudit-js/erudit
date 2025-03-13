import { defineElementTranspiler } from '@bitran-js/transpiler';

import { type DeatilsSchema, DetailsNode } from './shared';
import { DetailsParser, DetailsStringifier } from './factory';

export const detailsTranspiler = defineElementTranspiler<DeatilsSchema>({
    Node: DetailsNode,
    Parsers: [DetailsParser],
    Stringifier: DetailsStringifier,
});
