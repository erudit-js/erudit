import { defineIcon, defineLanguages } from '@bitran-js/renderer-vue';

import { defineAccentRenderer } from '@erudit-js/bitran-elements/accent/renderer';

export const termRenderer = defineAccentRenderer({
    colors: {
        text: 'light-dark( #65a63c, #a4c965)',
        background: 'light-dark( #f8feef, #2a3123)',
        border: 'light-dark( #dde7c9, #404b2d)',
    },
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
