import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { videoName, type VideoSchema } from './video.global';

export default defineAppElement<VideoSchema>({
    type: ElementType.Block,
    name: videoName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Video.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
