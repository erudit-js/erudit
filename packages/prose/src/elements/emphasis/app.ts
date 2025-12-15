import { defineEruditProseAppElement } from '../../app/appElement.js';
import { emphasisSchema } from './core.js';

export default defineEruditProseAppElement({
    schema: emphasisSchema,
    component: () => import('./Emphasis.vue'),
});
