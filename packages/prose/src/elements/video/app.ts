import { defineEruditProseAppElement } from '../../app/appElement.js';
import { videoSchema } from './core.js';

export default defineEruditProseAppElement({
    schema: videoSchema,
    component: () => import('./Video.vue'),
    languages: {
        en: () => import('./languages/en.js'),
        ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./icon.svg?raw'),
});
