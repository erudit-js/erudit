import { defineEruditProseAppElement } from '../../app/appElement.js';
import { hrSchema } from './core.js';

export default defineEruditProseAppElement({
    schema: hrSchema,
    component: () => import('./HorizontalLine.vue'),
});
