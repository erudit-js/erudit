import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { imageName, type ImageSchema } from './image.global';

export default defineAppElement<ImageSchema>({
    type: ElementType.Block,
    name: imageName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Image.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
