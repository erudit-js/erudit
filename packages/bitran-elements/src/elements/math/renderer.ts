import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import {
    BlockMathNode,
    InlineMathNode,
    type InlineMathSchema,
    type BlockMathSchema,
    blockMathRenderDataGenerator,
    inlineMathRenderDataGenerator,
} from './shared';

const icon = defineIcon(() => import('./icon.svg?raw'));
const languages = defineLanguages({
    en: () => import('./languages/en'),
    ru: () => import('./languages/ru'),
});

export const blockMathRenderer = defineElementVueRenderer<BlockMathSchema>({
    icon,
    languages,
    Node: BlockMathNode,
    component: defineComponent(() => import('./components/BlockMath.vue')),
    renderDataGenerator: blockMathRenderDataGenerator,
});

export const inlineMathRenderer = defineElementVueRenderer<InlineMathSchema>({
    icon,
    languages,
    Node: InlineMathNode,
    component: defineComponent(() => import('./components/InlineMath.vue')),
    renderDataGenerator: inlineMathRenderDataGenerator,
});
