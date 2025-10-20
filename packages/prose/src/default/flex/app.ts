import { flexName, type FlexSchema } from '.';
import { defineAppElement } from '../../app';
import { ElementType } from '../../type';

export default defineAppElement<FlexSchema>({
    type: ElementType.Block,
    name: flexName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Flex.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
