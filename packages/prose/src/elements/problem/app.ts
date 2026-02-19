import { defineProseAppElement } from '../../app/appElement.js';
import { problemSchema } from './problem.js';
import { problemsSchema, subProblemSchema } from './problems.js';

const icon = () => import('./assets/icon.svg?raw');

export default [
  defineProseAppElement({
    schema: problemSchema,
    component: () => import('./components/Problem.vue'),
    icon,
    languages: {
      en: () => import('./languages/problem/en.js'),
      ru: () => import('./languages/problem/ru.js'),
    },
  }),
  defineProseAppElement({
    schema: problemsSchema,
    component: () => import('./components/Problems.vue'),
    icon,
    languages: {
      en: () => import('./languages/problems/en.js'),
      ru: () => import('./languages/problems/ru.js'),
    },
  }),
  defineProseAppElement({
    schema: subProblemSchema,
    component: () => import('./components/SubProblem.vue'),
  }),
];
