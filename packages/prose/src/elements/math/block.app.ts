import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { blockMathName, type BlockMathSchema } from './block';

export default defineAppElement<BlockMathSchema>({
    type: ElementType.Block,
    name: blockMathName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./components/BlockMath.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
