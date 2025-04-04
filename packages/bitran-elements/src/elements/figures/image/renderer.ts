import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { ImageNode, type ImageSchema } from './shared';

export const imageRenderer = defineElementVueRenderer<ImageSchema>({
    Node: ImageNode,
    component: defineComponent(() => import('./Image.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    async createRenderData() {
        throw new Error(
            'Creating render data in SSR for Image element is not supported!',
        );
    },
});
