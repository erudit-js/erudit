import { defineIcon, defineLanguages } from '@bitran-js/renderer-vue';

import { defineAccentRenderer } from '../../renderer';

export const exampleRenderer = defineAccentRenderer({
    colors: {
        text: 'light-dark( #828282, #909090)',
        background: 'light-dark( #f6f6f6, #2d2d2d)',
        border: 'light-dark( #d5d5d5, #424242)',
    },
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
