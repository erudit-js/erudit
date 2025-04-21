import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import {
    CalloutNode,
    calloutRenderDataGenerator,
    type CalloutSchema,
} from './shared';

export const calloutRenderer = defineElementVueRenderer<CalloutSchema>({
    Node: CalloutNode,
    component: defineComponent(() => import('./Callout.vue')),
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    renderDataGenerator: calloutRenderDataGenerator,
});
