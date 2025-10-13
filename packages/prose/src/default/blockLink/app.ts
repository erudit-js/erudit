import { blockLinkName, type BlockLinkSchema } from '.';
import { defineAppElement } from '../../app';
import { ElementType } from '../../type';

export default defineAppElement<BlockLinkSchema>({
    type: ElementType.Block,
    name: blockLinkName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./BlockLink.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
