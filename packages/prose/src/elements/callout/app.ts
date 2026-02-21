import { defineProseAppElement } from '../../app/appElement.js';
import { calloutSchema } from './core.js';

export default defineProseAppElement({
  schema: calloutSchema,
  component: () => import('./Callout.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
