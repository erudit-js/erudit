import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { type AliasesSchema, AliasesNode } from './shared';

export const aliasesRenderer = defineElementVueRenderer<AliasesSchema>({
    Node: AliasesNode,
    component: defineComponent(() => import('./Aliases.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    canRender({ isDev }) {
        return isDev === true;
    },
});
