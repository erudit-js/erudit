import { defineIcon, defineLanguages } from '@bitran-js/renderer-vue';

import { defineAccentRenderer } from '@erudit-js/bitran-elements/accent/renderer';

export const statementRenderer = defineAccentRenderer({
    colors: {
        text: 'light-dark( #4a82b0, #6594c9)',
        background: 'light-dark( #eff7fe, #232b31)',
        border: 'light-dark( #c9d9e7, #2d3e4b)',
    },
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
