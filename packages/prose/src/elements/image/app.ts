import { defineProseAppElement } from '../../app/appElement.js';
import { imageSchema } from './core.js';

export default defineProseAppElement({
  schema: imageSchema,
  component: () => import('./Image.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
