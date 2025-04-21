import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { FlexNode, type FlexSchema } from './shared';

export const flexRenderer = defineElementVueRenderer<FlexSchema>({
    Node: FlexNode,
    component: defineComponent(() => import('./Flex.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
