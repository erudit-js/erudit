import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { EmphasisNode, type EmphasisSchema } from './shared';

export const emphasisRenderer = defineElementVueRenderer<EmphasisSchema>({
    Node: EmphasisNode,
    component: defineComponent(() => import('./Emphasis.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
