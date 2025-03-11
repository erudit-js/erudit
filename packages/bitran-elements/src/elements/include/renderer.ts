import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { IncludeNode } from './shared';

export const includeRenderer = defineElementVueRenderer({
    Node: IncludeNode,
    customLayout: true,
    component: defineComponent(() => import('./Include.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
