import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { TableNode, type TableSchema } from './shared';

export const tableRenderer = defineElementVueRenderer<TableSchema>({
    Node: TableNode,
    component: defineComponent(() => import('./TableElement.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
});
