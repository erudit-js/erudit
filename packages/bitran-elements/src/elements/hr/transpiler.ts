import { defineElementTranspiler } from '@bitran-js/transpiler';

import { HrNode, type HrSchema } from './shared';
import { HrParser, HrStringifier } from './factory';

export const hrTranspiler = defineElementTranspiler<HrSchema>({
    Node: HrNode,
    Parsers: [HrParser],
    Stringifier: HrStringifier,
});
