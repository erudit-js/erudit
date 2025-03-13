import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { type DetailsSchema, DetailsNode } from './shared';

export const detailsRenderer = defineElementVueRenderer<DetailsSchema>({
    Node: DetailsNode,
    component: defineComponent(() => import('./Details.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    canRender({ isDev }) {
        return isDev === true;
    },
});
