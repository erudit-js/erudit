import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { TodoNode, type TodoSchema } from './shared';

export const todoRenderer = defineElementVueRenderer<TodoSchema>({
    Node: TodoNode,
    component: defineComponent(() => import('./Todo.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    canRender({ isDev }) {
        return isDev === true;
    },
});
