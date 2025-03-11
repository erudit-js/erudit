import { defineElementTranspiler } from '@bitran-js/transpiler';

import { IncludeNode } from './shared';
import {
    IncludeParser,
    IncludeStringifier,
    ResolvedIncludeParser,
} from './factory';

export const includeTranspiler = defineElementTranspiler({
    Node: IncludeNode,
    Parsers: [IncludeParser, ResolvedIncludeParser],
    Stringifier: IncludeStringifier,
});
