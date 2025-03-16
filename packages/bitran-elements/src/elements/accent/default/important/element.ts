import { defineAccentElement } from '../../element';

export const importantName = 'important';

export const importantElement = defineAccentElement({
    async getTranspilerData() {
        return {
            objName: 'important',
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
                text: 'light-dark( #b04a4a, #c96565)',
                background: 'light-dark( #feefef, #312323)',
                border: 'light-dark( #e7c9c9, #4b2d2d)',
            },
        };
    },
});
