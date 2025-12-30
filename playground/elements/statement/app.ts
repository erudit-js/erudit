import { defineAccentApp } from '@erudit-js/prose/elements/accent/app';
import { statementAccent } from './core';

export default defineAccentApp({
    schema: statementAccent.accent.schema,
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
    icon: () => import('./icon.svg?raw'),
    accent: {
        colors: {
            text: 'light-dark( #4a82b0, #6594c9)',
            background: 'light-dark( #eff7fe, #232b31)',
            border: 'light-dark( #c9d9e7, #2d3e4b)',
        },
    },
});
