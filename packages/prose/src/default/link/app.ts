import { defineAppElement } from '../../app';
import { ElementType } from '../..';
import { linkName, type LinkSchema } from '.';

export default defineAppElement<LinkSchema>({
    type: ElementType.Inliner,
    name: linkName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Link.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
