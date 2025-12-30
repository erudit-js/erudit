import { defineEruditProseAppElement } from '../../../app/appElement.js';
import { referenceSchema, refSchema } from './core.js';

export default [
    defineEruditProseAppElement({
        schema: refSchema,
        component: () => import('../Link.vue'),
    }),
    defineEruditProseAppElement({
        schema: referenceSchema,
        component: () => import('../BlockLink.vue'),
        icon: () => import('../icon.svg?raw'),
        languages: {
            en: () => import('./languages/en.js'),
            ru: () => import('./languages/ru.js'),
        },
    }),
];
