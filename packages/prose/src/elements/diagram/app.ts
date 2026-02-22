import { defineProseAppElement } from '../../app/appElement.js';
import { diagramSchema } from './core.js';

export default defineProseAppElement({
  schema: diagramSchema,
  component: () => import('./Diagram.vue'),
  languages: {
    en: () => import('./languages/en.js'),
    ru: () => import('./languages/ru.js'),
  },
  icon: () => import('./icon.svg?raw'),
});
