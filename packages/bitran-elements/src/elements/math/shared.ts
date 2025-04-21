import {
    BlockNode,
    InlinerNode,
    type DefineElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';

import { type BlockMathGroup } from './block';
import { type InlineMathData } from './inline';

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

function mathKey(node: BlockMathNode | InlineMathNode) {
    const isBlockMath = node instanceof BlockMathNode;
    const parseData = node.parseData;

    return `${isBlockMath ? blockMathName : inlineMathName}:${parseData.src.slice(parseData.range[0], parseData.range[1])}`;
}

export const blockMathRenderDataGenerator: RenderDataGenerator<BlockMathSchema> =
    {
        createKey({ node }) {
            return mathKey(node);
        },
        async createValue({ node }) {
            const renderBlockMath = (await import('./block')).renderBlockMath;
            return await renderBlockMath(getMathExpresion(node));
        },
    };

export const inlineMathRenderDataGenerator: RenderDataGenerator<InlineMathSchema> =
    {
        createKey({ node }) {
            return mathKey(node);
        },
        async createValue({ node }) {
            const renderInlineMath = (await import('./inline'))
                .renderInlineMath;
            return await renderInlineMath(getMathExpresion(node));
        },
    };
