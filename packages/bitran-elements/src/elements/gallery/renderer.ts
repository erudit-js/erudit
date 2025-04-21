import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { GalleryNode, type GallerySchema } from './shared';
import { imageRenderDataKey } from '../image/shared';

export const galleryRenderer = defineElementVueRenderer<GallerySchema>({
    Node: GalleryNode,
    component: defineComponent(() => import('./Gallery.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    renderDataGenerator: {
        createValue({ storage, node }) {
            return {
                images: node.parseData.images.map((image) => {
                    const imageKey = imageRenderDataKey(image.src);
                    const imageValue = storage[imageKey];

                    if (!imageValue || imageValue.type === 'error') {
                        throw new Error(
                            `Image render data not found in storage or has error state: ${imageKey}!`,
                        );
                    }

                    return imageValue.data;
                }),
            };
        },
    },
});
