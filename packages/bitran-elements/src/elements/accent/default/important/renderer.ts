import { defineIcon, defineLanguages } from '@bitran-js/renderer-vue';

import { defineAccentRenderer } from '../../renderer';

export const importantRenderer = defineAccentRenderer({
    colors: {
        text: 'light-dark( #b04a4a, #c96565)',
        background: 'light-dark( #feefef, #312323)',
        border: 'light-dark( #e7c9c9, #4b2d2d)',
    },
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
