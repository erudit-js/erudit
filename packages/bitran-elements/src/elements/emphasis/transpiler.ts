import { defineElementTranspiler } from '@bitran-js/transpiler';

import { EmphasisNode, type EmphasisSchema } from './shared';
import { EmphasisStringifier, ItalicParser, StrongParser } from './factory';

export const emphasisTranspiler = defineElementTranspiler<EmphasisSchema>({
    Node: EmphasisNode,
    Parsers: [StrongParser, ItalicParser],
    Stringifier: EmphasisStringifier,
});
