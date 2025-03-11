import { defineElementTranspiler } from '@bitran-js/transpiler';

import {
    BlockMathNode,
    getMathExpresion,
    InlineMathNode,
    type BlockMathSchema,
    type InlineMathSchema,
} from './shared';
import { BlockMathParser, InlineMathParser, MathStringifier } from './factory';
import { renderBlockMath } from './block';
import { renderInlineMath } from './inline';

export const blockMathTranspiler = defineElementTranspiler<BlockMathSchema>({
    Node: BlockMathNode,
    Parsers: [BlockMathParser],
    Stringifier: MathStringifier,
    async createPreRenderData(node: BlockMathNode) {
        return renderBlockMath(getMathExpresion(node));
    },
});

export const inlineMathTranspiler = defineElementTranspiler<InlineMathSchema>({
    Node: InlineMathNode,
    Parsers: [InlineMathParser],
    Stringifier: MathStringifier,
    async createPreRenderData(node: InlineMathNode) {
        return renderInlineMath(getMathExpresion(node));
    },
});
