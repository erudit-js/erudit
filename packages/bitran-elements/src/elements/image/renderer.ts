import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import {
    ImageNode,
    imageRenderDataGenerator,
    type ImageSchema,
} from './shared';

export const imageRenderer = defineElementVueRenderer<ImageSchema>({
    Node: ImageNode,
    component: defineComponent(() => import('./ImageElement.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    renderDataGenerator: imageRenderDataGenerator,
});
