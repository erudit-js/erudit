import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { galleryName, type GallerySchema } from './gallery.global';

export default defineAppElement<GallerySchema>({
    type: ElementType.Block,
    name: galleryName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Gallery.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
