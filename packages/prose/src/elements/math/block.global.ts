import { defineGlobalElement } from '../../globalElement';
import {
    BlockMath,
    blockMathName,
    resolveMathGroups,
    type BlockMathSchema,
    type MathGroup,
} from './block';

export default defineGlobalElement<BlockMathSchema>()({
    name: blockMathName,
    tags: { BlockMath },
    async createStorageData(element) {
        let result: MathGroup = {
            gap: { type: 'normal' },
            parts: ['<span style="color: red">KaTeX Error!</span>'],
        };

        try {
            result = await resolveMathGroups(element.data.katex);
        } catch (error) {
            console.error('Error while rendering math:', error);
        }

        return result;
    },
    dependencies: {
        ['katex']: {
            transpile: true,
            optimize: true,
        },
    },
});
