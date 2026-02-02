import { defineEruditProseAppElement } from '../../../app/appElement.js';
import { dependencySchema, depSchema } from './core.js';

export default [
  defineEruditProseAppElement({
    schema: depSchema,
    component: () => import('../Link.vue'),
  }),
  defineEruditProseAppElement({
    schema: dependencySchema,
    component: () => import('../BlockLink.vue'),
    icon: () => import('../icon.svg?raw'),
    languages: {
      en: () => import('./languages/en.js'),
      ru: () => import('./languages/ru.js'),
    },
  }),
];
