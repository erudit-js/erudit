import { defineElementTranspiler } from '@bitran-js/transpiler';

import { CalloutNode } from './shared';
import { CalloutParser, CalloutStringifier } from './factory';

export const calloutTranspiler = defineElementTranspiler({
    Node: CalloutNode,
    Parsers: [CalloutParser],
    Stringifier: CalloutStringifier,
});
