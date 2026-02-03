import { defineEruditProseAppElement } from '../../app/appElement.js';
import { brSchema } from './core.js';

export default defineEruditProseAppElement({
  schema: brSchema,
  component: () => import('./LineBreak.vue'),
});
