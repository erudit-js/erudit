import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { headingName, type HeadingSchema } from '.';

export default defineAppElement<HeadingSchema>({
    type: ElementType.Block,
    name: headingName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Heading.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
