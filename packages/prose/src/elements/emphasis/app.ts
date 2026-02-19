import { defineProseAppElement } from '../../app/appElement.js';
import { emphasisSchema } from './core.js';

export default defineProseAppElement({
  schema: emphasisSchema,
  component: () => import('./Emphasis.vue'),
});
