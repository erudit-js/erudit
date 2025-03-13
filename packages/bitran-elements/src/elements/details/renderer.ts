import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { type DeatilsSchema, DetailsNode } from './shared';

export const detailsRenderer = defineElementVueRenderer<DeatilsSchema>({
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
