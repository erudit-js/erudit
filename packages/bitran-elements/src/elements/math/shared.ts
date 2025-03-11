import {
    BlockNode,
    InlinerNode,
    type DefineElementSchema,
} from '@bitran-js/core';

import type { BlockMathGroup } from './block';
import type { InlineMathData } from './inline';

export const blockMathName = 'math';
export const inlineMathName = 'imath';

export type MathParseData = {
    src: string;
    range: [number, number];
};

export type BlockMathSchema = DefineElementSchema<{
    ParseData: MathParseData;
    Meta: { freeze?: boolean };
    RenderData: BlockMathGroup;
}>;

export class BlockMathNode extends BlockNode<BlockMathSchema> {}

export type InlineMathSchema = DefineElementSchema<{
    ParseData: MathParseData;
    RenderData: InlineMathData;
}>;

export class InlineMathNode extends InlinerNode<InlineMathSchema> {}

export const getMathExpresion = (node: BlockMathNode | InlineMathNode) =>
    node.parseData.src
        .substring(node.parseData.range[0], node.parseData.range[1])
        .trim();
