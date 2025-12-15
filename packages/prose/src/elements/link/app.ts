import { defineEruditProseAppElement } from '../../app/appElement.js';
import { blockLinkSchema, linkSchema } from './core.js';

export default [
    defineEruditProseAppElement({
        schema: linkSchema,
        component: () => import('./Link.vue'),
    }),
    defineEruditProseAppElement({
        schema: blockLinkSchema,
        component: () => import('./BlockLink.vue'),
        icon: () => import('./icon.svg?raw'),
        languages: {
            en: () => import('./languages/en.js'),
            ru: () => import('./languages/ru.js'),
        },
    }),
];
