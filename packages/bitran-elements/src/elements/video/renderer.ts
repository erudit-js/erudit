import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { VideoNode, type VideoSchema } from './shared';

export const videoRenderer = defineElementVueRenderer<VideoSchema>({
    Node: VideoNode,
    component: defineComponent(() => import('./VideoElement.vue')),
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
