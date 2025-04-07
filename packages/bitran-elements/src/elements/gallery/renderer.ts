import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { GalleryNode, type GallerySchema } from './shared';

export const galleryRenderer = defineElementVueRenderer<GallerySchema>({
    Node: GalleryNode,
    component: defineComponent(() => import('./Gallery.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    async createRenderData() {
        throw new Error(
            'Creating render data in SSR for Gallery element is not supported!',
        );
    },
});
