<script lang="ts" setup>
import { h } from 'vue';
import 'katex/dist/katex.min.css';

const { mode, math, freeze } = defineProps<{
    mode: 'inline' | 'block';
    math: string;
    freeze: boolean;
}>();

const MathComponent = h(mode === 'block' ? 'div' : 'span', {
    innerHTML: math,
});
</script>

<template>
    <component
        :is="MathComponent"
        v-once
        :class="[
            $style.math,
            {
                [`nice-scrollbars overflow-auto ${$style.blockMath}`]:
                    mode === 'block',
                [$style.freeze]: freeze,
            },
        ]"
    />
</template>

<style module>
.math {
    --katex-color_brand: var(--color-brand);
    --katex-color_blue: light-dark(#0f82ff, #4aa0df);
    --katex-color_green: light-dark(#519f19, #83c167);
    --katex-color_yellow: light-dark(#c99029, #c1a267);
    --katex-color_red: light-dark(#d73737, #fc6255);
    --katex-color_default: var(--color-text);

    color: var(--katex-color_default);

    /* Map KaTeX color codes to CSS variables */
    [style*='color:#100000'] {
        color: var(--katex-color_brand) !important;
    }
    [style*='color:#200000'] {
        color: var(--katex-color_blue) !important;
    }
    [style*='color:#300000'] {
        color: var(--katex-color_green) !important;
    }
    [style*='color:#400000'] {
        color: var(--katex-color_yellow) !important;
    }
    [style*='color:#500000'] {
        color: var(--katex-color_red) !important;
    }
    [style*='color:#600000'] {
        color: var(--katex-color_default) !important;
    }
}

.blockMath {
    overflow-x: auto;
    overflow-y: hidden;

    :global(.katex-display) {
        margin: 0;
        margin-top: calc(-1 * var(--mathRowGap));
    }

    :global(.base) {
        margin-top: var(--mathRowGap);
        padding-bottom: 1px;
    }

    &:not(.freeze) {
        :global(.katex-display > .katex) {
            white-space: normal;
        }
    }

    &.freeze {
        min-width: 0;
    }
}
</style>
