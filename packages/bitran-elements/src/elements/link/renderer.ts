import {
    defineElementVueRenderer,
    defineComponent,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { LinkNode, type LinkSchema } from './shared';

export const linkRenderer = defineElementVueRenderer<LinkSchema>({
    Node: LinkNode,
    component: defineComponent(() => import('./Link.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    createRenderData: async () => {
        throw Error('Render data for Links must be built only on server side!');
    },
});
