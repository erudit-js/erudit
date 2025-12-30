import { defineAccentApp } from '@erudit-js/prose/elements/accent/app';
import { importantAccent } from './core';

export default defineAccentApp({
    schema: importantAccent.accent.schema,
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
    icon: () => import('./icon.svg?raw'),
    accent: {
        colors: {
            text: 'light-dark( #b04a4a, #c96565)',
            background: 'light-dark( #feefef, #312323)',
            border: 'light-dark( #e7c9c9, #4b2d2d)',
        },
    },
});
