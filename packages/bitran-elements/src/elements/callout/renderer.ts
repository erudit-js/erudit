import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import { CalloutNode, type CalloutSchema } from './shared';

export const calloutRenderer = defineElementVueRenderer<CalloutSchema>({
    Node: CalloutNode,
    component: defineComponent(() => import('./Callout.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    async createRenderData() {
        throw new Error(
            'Creating render data in SSR for Callout element is not supported!',
        );
    },
});
