import { defineElementTranspiler } from '@bitran-js/transpiler';

import { type DetailsSchema, DetailsNode } from './shared';
import { DetailsParser, DetailsStringifier } from './factory';

export const detailsTranspiler = defineElementTranspiler<DetailsSchema>({
    Node: DetailsNode,
    Parsers: [DetailsParser],
    Stringifier: DetailsStringifier,
});
