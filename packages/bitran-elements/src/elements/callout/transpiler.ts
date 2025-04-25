import { defineElementTranspiler } from '@bitran-js/transpiler';

import { CalloutNode, type CalloutSchema } from './shared';
import { CalloutParser, CalloutStringifier } from './factory';

export const calloutTranspiler = defineElementTranspiler<CalloutSchema>({
    Node: CalloutNode,
    Parsers: [CalloutParser],
    Stringifier: CalloutStringifier,
});
