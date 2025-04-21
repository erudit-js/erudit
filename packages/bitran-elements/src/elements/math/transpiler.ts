import { defineElementTranspiler } from '@bitran-js/transpiler';

import {
    BlockMathNode,
    blockMathRenderDataGenerator,
    InlineMathNode,
    inlineMathRenderDataGenerator,
    type BlockMathSchema,
    type InlineMathSchema,
} from './shared';
import { BlockMathParser, InlineMathParser, MathStringifier } from './factory';

export const blockMathTranspiler = defineElementTranspiler<BlockMathSchema>({
    Node: BlockMathNode,
    Parsers: [BlockMathParser],
    Stringifier: MathStringifier,
    renderDataGenerator: blockMathRenderDataGenerator,
});

export const inlineMathTranspiler = defineElementTranspiler<InlineMathSchema>({
    Node: InlineMathNode,
    Parsers: [InlineMathParser],
    Stringifier: MathStringifier,
    renderDataGenerator: inlineMathRenderDataGenerator,
});
