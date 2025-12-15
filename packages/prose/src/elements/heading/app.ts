import { defineEruditProseAppElement } from '../../app/appElement.js';
import { headingSchema } from './core.js';

export default defineEruditProseAppElement({
    schema: headingSchema,
    component: () => import('./Heading.vue'),
    languages: {
        en: () => import('./languages/en.js'),
        ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./icon.svg?raw'),
});
