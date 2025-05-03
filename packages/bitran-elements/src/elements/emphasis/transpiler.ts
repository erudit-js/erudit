import { defineElementTranspiler } from '@bitran-js/transpiler';

import { EmphasisNode, type EmphasisSchema } from './shared';
import { EmphasisParser, EmphasisStringifier } from './factory';

export const emphasisTranspiler = defineElementTranspiler<EmphasisSchema>({
    Node: EmphasisNode,
    Parsers: [EmphasisParser],
    Stringifier: EmphasisStringifier,
});
