<script lang="ts" setup>
import 'katex/dist/katex.min.css';

import ProseInliner from '../../../app/front/components/ProseInliner.vue';
import { useElementStorage } from '../../../app/front/composables/elementStorage';
import type { ParsedElement } from '../../../element';
import type { InlinerMathSchema } from '../inliner';
import Katex from './Katex.vue';

const { element } = defineProps<{
    element: ParsedElement<InlinerMathSchema>;
}>();
const inlinerMathStorage = await useElementStorage<InlinerMathSchema>(element);
</script>

<template>
    <ProseInliner :element>
        <template v-if="inlinerMathStorage.type === 'text'">
            <span :class="[$style.inlinerMath, $style.textMath]">
                <template v-for="token of inlinerMathStorage.tokens">
                    <span :class="{ [$style.word]: token.type === 'word' }">
                        {{ token.value }}
                    </span>
                </template>
            </span>
        </template>
        <Katex
            v-else
            :class="$style.inlinerMath"
            :math="inlinerMathStorage.mathHtml"
            mode="inline"
            :freeze="false"
        />
    </ProseInliner>
</template>

<style module>
.inlinerMath {
    --katex-color_default: light-dark(
        color-mix(in hsl, var(--color-text-muted), var(--color-brand) 35%),
        color-mix(in hsl, var(--color-text), var(--color-brand) 30%)
    );
}

.textMath {
    font:
        normal 1.15em KaTeX_Main,
        Times New Roman,
        serif;
    line-height: 1.2;
    text-indent: 0;
    color: var(--katex-color_default);

    .word {
        font-family: KaTeX_Math;
        font-style: italic;
    }
}
</style>
