import {
    defineElementVueRenderer,
    defineComponent,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { LinkNode, linkRenderDataGenerator, type LinkSchema } from './shared';

export const linkRenderer = defineElementVueRenderer<LinkSchema>({
    Node: LinkNode,
    component: defineComponent(() => import('./Link.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    renderDataGenerator: linkRenderDataGenerator,
});
