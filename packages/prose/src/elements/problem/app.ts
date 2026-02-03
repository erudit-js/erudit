import { defineEruditProseAppElement } from '../../app/appElement.js';
import { problemSchema } from './problem.js';
import { problemsSchema, subProblemSchema } from './problems.js';

export default [
  defineEruditProseAppElement({
    schema: problemSchema,
    component: () => import('./components/Problem.vue'),
    languages: {
      en: () => import('./languages/en.js'),
      ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./assets/icon.svg?raw'),
  }),
  defineEruditProseAppElement({
    schema: subProblemSchema,
    component: () => import('./components/SubProblem.vue'),
  }),
  defineEruditProseAppElement({
    schema: problemsSchema,
    component: () => import('./components/Problems.vue'),
    languages: {
      en: () => import('./languages/en.js'),
      ru: () => import('./languages/ru.js'),
    },
    icon: () => import('./assets/icon.svg?raw'),
  }),
];
