import { defineProseAppElement } from '../../app/appElement.js';
import { blockMathSchema } from './block.js';
import { inlinerMathSchema } from './inliner.js';

export default [
  defineProseAppElement({
    schema: blockMathSchema,
    component: () => import('./components/BlockMath.vue'),
    languages: {
      en: () => import('./languages/en.js'),
      ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./icon.svg?raw'),
  }),
  defineProseAppElement({
    schema: inlinerMathSchema,
    component: () => import('./components/InlinerMath.vue'),
    languages: {
      en: () => import('./languages/en.js'),
      ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./icon.svg?raw'),
  }),
];
