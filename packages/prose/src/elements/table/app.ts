import { defineEruditProseAppElement } from '../../app/appElement.js';
import { tableSchema } from './core.js';

export default defineEruditProseAppElement({
    schema: tableSchema,
    component: () => import('./Table.vue'),
    languages: {
        en: () => import('./languages/en.js'),
        ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./icon.svg?raw'),
});
