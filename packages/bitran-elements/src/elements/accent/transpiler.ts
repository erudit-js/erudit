import { defineProvideElementTranspiler } from '@bitran-js/transpiler';

import { AccentNode, type AccentSchema } from './shared';
import { AccentParser, AccentStringifier } from './factory';

export const defineAccentTranspiler =
    defineProvideElementTranspiler<AccentSchema>({
        Node: AccentNode,
        Parsers: [AccentParser],
        Stringifier: AccentStringifier,
    });
