import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import {
    BlockLinkNode,
    blockLinkRenderDataGenerator,
    type BlockLinkSchema,
} from './shared';

export const blockLinkRenderer = defineElementVueRenderer<BlockLinkSchema>({
    Node: BlockLinkNode,
    component: defineComponent(() => import('./BlockLink.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    renderDataGenerator: blockLinkRenderDataGenerator,
});
