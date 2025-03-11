import { defineBitranElement } from '@erudit-js/cog/schema';

import type { BlockMathSchema, InlineMathSchema } from './shared';

export const blockMathElement = defineBitranElement<BlockMathSchema>({
    async transpiler() {
        const { blockMathTranspiler } = await import('./transpiler');
        return blockMathTranspiler;
    },
    async renderer() {
        const { blockMathRenderer } = await import('./renderer');
        return blockMathRenderer;
    },
});

export const inlineMathElement = defineBitranElement<InlineMathSchema>({
    async transpiler() {
        const { inlineMathTranspiler } = await import('./transpiler');
        return inlineMathTranspiler;
    },
    async renderer() {
        const { inlineMathRenderer } = await import('./renderer');
        return inlineMathRenderer;
    },
});
