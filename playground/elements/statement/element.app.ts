import { defineAccentApp } from '@erudit-js/prose/elements/accent/appDefinition';

import { statementSchema } from './element.schema';

export default defineAccentApp({
    schema: statementSchema,
    color: 'light-dark( #4a82b0, #6594c9)',
    icon: () => import('./icon.svg?raw'),
    languages: {
        en: () => import('./languages/en'),
    },
});
