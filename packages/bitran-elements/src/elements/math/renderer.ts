import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import {
    BlockMathNode,
    InlineMathNode,
    getMathExpresion,
    type InlineMathSchema,
    type BlockMathSchema,
} from './shared';
import { renderBlockMath } from './block';
import { renderInlineMath } from './inline';

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
    async createRenderData(node: BlockMathNode) {
        return renderBlockMath(getMathExpresion(node));
    },
});

export const inlineMathRenderer = defineElementVueRenderer<InlineMathSchema>({
    icon,
    languages,
    Node: InlineMathNode,
    component: defineComponent(() => import('./components/InlineMath.vue')),
    async createRenderData(node: InlineMathNode) {
        return renderInlineMath(getMathExpresion(node));
    },
});
