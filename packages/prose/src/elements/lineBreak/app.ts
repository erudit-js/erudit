import { defineProseAppElement } from '../../app/appElement.js';
import { brSchema } from './core.js';

export default defineProseAppElement({
  schema: brSchema,
  component: () => import('./LineBreak.vue'),
});
