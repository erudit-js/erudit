import { defineAccentElement } from '../../element';

export const exampleName = 'example';

export const exampleElement = defineAccentElement({
    async getTranspilerData() {
        return {
            objName: 'example',
        };
    },
    async getRenderData() {
        const { defineIcon, defineLanguages } = await import(
            '@bitran-js/renderer-vue'
        );

        return {
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
        };
    },
});
