import { defineElementTranspiler } from '@bitran-js/transpiler';

import { FlexNode, type FlexSchema } from './shared';
import { FlexParser, FlexStringifier } from './factory';

export const flexTranspiler = defineElementTranspiler<FlexSchema>({
    Node: FlexNode,
    Parsers: [FlexParser],
    Stringifier: FlexStringifier,
});
