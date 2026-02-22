import { defineProseAppElement } from '../../app/appElement.js';
import { hrSchema } from './core.js';

export default defineProseAppElement({
  schema: hrSchema,
  component: () => import('./HorizontalLine.vue'),
});
