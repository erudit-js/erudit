import { defineEruditProseAppElement } from '../../app/appElement.js';
import { flexSchema } from './core.js';

export default defineEruditProseAppElement({
  schema: flexSchema,
  component: () => import('./Flex.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
