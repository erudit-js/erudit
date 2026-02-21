import { defineProseAppElement } from '../../app/appElement.js';
import { detailsSchema } from './core.js';

export default defineProseAppElement({
  schema: detailsSchema,
  component: () => import('./Details.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
