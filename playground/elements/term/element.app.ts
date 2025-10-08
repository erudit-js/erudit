import { defineAccentApp } from '@erudit-js/prose/elements/accent/appDefinition';

import { termSchema } from './element.schema';

export default defineAccentApp({
    schema: termSchema,
    context: {
        colors: {
            text: 'light-dark(#65a63c, #a4c965)',
            background: 'light-dark(#f8feef, #2a3123)',
            border: 'light-dark(#dde7c9, #404b2d)',
        },
    },
    icon: () => import('./icon.svg?raw'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
