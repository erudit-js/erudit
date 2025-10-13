import { detailsName, type DetailsSchema } from '.';
import { defineAppElement } from '../../app';
import { ElementType } from '../../type';

export default defineAppElement<DetailsSchema>({
    type: ElementType.Block,
    name: detailsName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Details.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
