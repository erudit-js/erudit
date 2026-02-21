import { defineProseAppElement } from '../../app/appElement.js';
import { captionSchema } from './core.js';

export default defineProseAppElement({
  schema: captionSchema,
  component: () => import('./Caption.vue'),
});
