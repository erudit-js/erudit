import { defineAccentElement } from '@erudit-js/bitran-elements/accent/element';

export const statementName = 'statement';

export const statementElement = defineAccentElement({
    async getTranspilerData() {
        return {
            objName: 'statement',
        };
    },
    async getRenderData() {
        const { defineIcon, defineLanguages } = await import(
            '@bitran-js/renderer-vue'
        );

        return {
            icon: defineIcon(() => import('./icon.svg?raw')),
            languages: defineLanguages({
                en: () => import('./languages/en'),
                ru: () => import('./languages/ru'),
            }),
            colors: {
                text: 'light-dark( #4a82b0, #6594c9)',
                background: 'light-dark( #eff7fe, #232b31)',
                border: 'light-dark( #c9d9e7, #2d3e4b)',
            },
        };
    },
});
