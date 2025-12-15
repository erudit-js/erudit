import { defineAccentApp } from '@erudit-js/prose/elements/accent/app';
import { termAccent } from './core';

export default defineAccentApp({
    schema: termAccent.accent.schema,
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
    icon: () => import('./icon.svg?raw'),
    accent: {
        colors: {
            text: 'light-dark(#65a63c, #a4c965)',
            background: 'light-dark(#f8feef, #2a3123)',
            border: 'light-dark(#dde7c9, #404b2d)',
        },
    },
});
