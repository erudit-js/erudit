import { defineElementTranspiler } from '@bitran-js/transpiler';

import { BlockLinkNode, type BlockLinkSchema } from './shared';
import { BlockLinkParser, BlockLinkStringifier } from './factory';

export const blockLinkTranspiler = defineElementTranspiler<BlockLinkSchema>({
    Node: BlockLinkNode,
    Parsers: [BlockLinkParser],
    Stringifier: BlockLinkStringifier,
});
