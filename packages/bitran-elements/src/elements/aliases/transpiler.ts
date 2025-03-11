import { defineElementTranspiler } from '@bitran-js/transpiler';

import { type AliasesSchema, AliasesNode } from './shared';
import { AliasesParser, AliasesStringifier } from './factory';

export const aliasesTranspiler = defineElementTranspiler<AliasesSchema>({
    Node: AliasesNode,
    Parsers: [AliasesParser],
    Stringifier: AliasesStringifier,
});
