import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { ListNode, type ListSchema } from './shared';

export const listRenderer = defineElementVueRenderer<ListSchema>({
    Node: ListNode,
    component: defineComponent(() => import('./List.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
