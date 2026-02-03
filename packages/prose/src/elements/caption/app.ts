import { defineEruditProseAppElement } from '../../app/appElement.js';
import { captionSchema } from './core.js';

export default defineEruditProseAppElement({
  schema: captionSchema,
  component: () => import('./Caption.vue'),
});
