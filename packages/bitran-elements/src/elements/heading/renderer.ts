import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { type HeadingSchema, HeadingNode } from './shared';

export const headingRenderer = defineElementVueRenderer<HeadingSchema>({
    Node: HeadingNode,
    component: defineComponent(() => import('./Heading.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
