import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { DiagramNode, type DiagramSchema } from './shared';

export const diagramRenderer = defineElementVueRenderer<DiagramSchema>({
    Node: DiagramNode,
    component: defineComponent(() => import('./Diagram.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    ssr: true,
});
