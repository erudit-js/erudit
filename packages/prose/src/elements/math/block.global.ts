import { defineGlobalElement } from '../../globalElement';
import {
    BlockMath,
    blockMathName,
    resolveMathGroups,
    type BlockMathSchema,
} from './block';

export default defineGlobalElement<BlockMathSchema>()({
    name: blockMathName,
    tags: { BlockMath },
    async createStorageData(element) {
        return await resolveMathGroups(element.data.katex);
    },
    dependencies: {
        ['katex']: {
            transpile: true,
            optimize: true,
        },
    },
});
