import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { HrNode, type HrSchema } from './shared';

export const hrRenderer = defineElementVueRenderer<HrSchema>({
    Node: HrNode,
    component: defineComponent(() => import('./HrElement.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    customLayout: true,
});
