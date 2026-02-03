import { defineEruditProseAppElement } from '../../app/appElement.js';
import { calloutSchema } from './core.js';

export default defineEruditProseAppElement({
  schema: calloutSchema,
  component: () => import('./Callout.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
