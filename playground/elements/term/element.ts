import { defineAccentElement } from '@erudit-js/bitran-elements/accent/element';

export const termName = 'term';

export const termElement = defineAccentElement({
    async getTranspilerData() {
        return {
            objName: 'term',
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
                text: 'light-dark( #65a63c, #a4c965)',
                background: 'light-dark( #f8feef, #2a3123)',
                border: 'light-dark( #dde7c9, #404b2d)',
            },
        };
    },
});
