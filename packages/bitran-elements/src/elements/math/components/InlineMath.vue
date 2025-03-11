<script lang="ts" setup>
import type { ElementProps } from '@bitran-js/renderer-vue';

import type { InlineMathSchema } from '../shared';
import MathKatex from './MathKatex.vue';

const props = defineProps<ElementProps<InlineMathSchema>>();
const renderData = props.node.renderData;
</script>

<template>
    <template v-if="renderData.type === 'string'">
        <span :class="[$style.inlineMath, $style.stringMath]">
            <template v-for="token of renderData.tokens">
                <span v-if="token.type === 'word'" :class="$style.word">{{
                    token.value
                }}</span>
                <template v-else>{{ token.value }}</template>
            </template>
        </span>
    </template>
    <MathKatex
        v-else
        :class="$style.inlineMath"
        :displayMath="false"
        :mathHtml="renderData.html"
    />
</template>

<style lang="scss">
@use 'katex/dist/katex.min.css';
</style>

<style lang="scss" module>
.inlineMath {
    color: light-dark(#3e6084, #a7b3c7);
}

.stringMath {
    font:
        normal 1.15em KaTeX_Main,
        Times New Roman,
        serif;
    line-height: 1.2;
    text-indent: 0;

    .word {
        font-family: KaTeX_Math;
        font-style: italic;
    }
}
</style>
