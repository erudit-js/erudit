import { defineEruditProseAppElement } from '../../app/appElement.js';
import { listSchema } from './core.js';

export default defineEruditProseAppElement({
    schema: listSchema,
    component: () => import('./List.vue'),
    languages: {
        en: () => import('./languages/en.js'),
        ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./icon.svg?raw'),
});
