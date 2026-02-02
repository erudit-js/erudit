import { defineEruditProseAppElement } from '../../app/appElement.js';
import { paragraphSchema } from './core.js';

export default defineEruditProseAppElement({
  schema: paragraphSchema,
  component: () => import('./Paragraph.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
