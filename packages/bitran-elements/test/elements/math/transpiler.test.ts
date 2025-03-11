import type { InlinerNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    blockMathName,
    inlineMathName,
    BlockMathNode,
    InlineMathNode,
} from '../../../src/elements/math/shared';
import {
    blockMathTranspiler,
    inlineMathTranspiler,
} from '../../../src/elements/math/transpiler';

export function getRangedSlice(src: string, range: [number, number]) {
    return src.slice(range[0], range[1]);
}

const bitran = defineBitranTranspiler({
    [inlineMathName]: inlineMathTranspiler,
    [blockMathName]: blockMathTranspiler,
});

describe('Block Math', () => {
    it('should parse math with @math object block syntax', async () => {
        const text = `
@math
    A^2 + B^2 = C^2
    \\\\
    \\frac{a}{b}
        `.trim();
        const parsed = await bitran.parser.parse(text);
        const mathNode = parsed.children?.[0] as BlockMathNode;
        expect(mathNode).toBeInstanceOf(BlockMathNode);
        expect(mathNode.parseData.src).toBe(
            '@math\n    A^2 + B^2 = C^2\n    \\\\\n    \\frac{a}{b}',
        );
        expect(
            getRangedSlice(mathNode.parseData.src, mathNode.parseData.range),
        ).toBe('\n    A^2 + B^2 = C^2\n    \\\\\n    \\frac{a}{b}');
    });

    it('should parse math with $$ syntax', async () => {
        const text = `
$$ A^2 + B^2 = C^2 \\\\ \\frac{a}{b} $$
        `.trim();
        const parsed = await bitran.parser.parse(text);
        const mathNode = parsed.children?.[0] as BlockMathNode;
        expect(mathNode).toBeInstanceOf(BlockMathNode);
        expect(mathNode.parseData.src).toBe(
            '$$ A^2 + B^2 = C^2 \\\\ \\frac{a}{b} $$',
        );
        expect(
            getRangedSlice(mathNode.parseData.src, mathNode.parseData.range),
        ).toBe(' A^2 + B^2 = C^2 \\\\ \\frac{a}{b} ');
    });
});

describe('Inline Math', () => {
    it('should parse math mode', async () => {
        const text = `Some $a^2$ te$x$t.`;
        const parsed = (await bitran.parser.parseInliners(
            text,
        )) as InlinerNode[];

        const mathNode1 = parsed?.[1] as InlineMathNode;
        expect(mathNode1).toBeInstanceOf(InlineMathNode);
        expect(mathNode1.parseData.src).toBe('$a^2$');
        expect(
            getRangedSlice(mathNode1.parseData.src, mathNode1.parseData.range),
        ).toBe('a^2');

        const mathNode2 = parsed?.[3] as InlineMathNode;
        expect(mathNode2).toBeInstanceOf(InlineMathNode);
        expect(mathNode2.parseData.src).toBe('$x$');
        expect(
            getRangedSlice(mathNode2.parseData.src, mathNode2.parseData.range),
        ).toBe('x');
    });
});
