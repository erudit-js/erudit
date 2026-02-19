import { defineProseAppElement } from '../../app/appElement.js';
import { gallerySchema } from './core.js';

export default defineProseAppElement({
  schema: gallerySchema,
  component: () => import('./Gallery.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
