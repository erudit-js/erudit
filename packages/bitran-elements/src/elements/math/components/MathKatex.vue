<script lang="ts" setup>
import { h, useCssModule } from 'vue';

const props = defineProps<{
    displayMath: boolean;
    mathHtml: string;
    freeze?: boolean;
}>();

const style = useCssModule();

const MathComponent = h(props.displayMath ? 'div' : 'span', {
    class: [
        style.latexMath,
        props.displayMath && style.latexDisplayMath,
        props.freeze && style.latexFreeze,
    ],
    innerHTML: props.mathHtml,
});
</script>

<template>
    <component :is="MathComponent" v-once />
</template>

<style lang="scss">
@use 'katex/dist/katex.min.css';

.bitran-component {
    --katex-color_brand: var(--bitran_colorBrand);
    --katex-color_blue: light-dark(#0f82ff, #4aa0df);
    --katex-color_green: light-dark(#519f19, #83c167);
    --katex-color_yellow: light-dark(#c99029, #c1a267);
    --katex-color_red: light-dark(#d73737, #fc6255);
}
</style>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/bp';

.latexMath {
    //
    // KaTeX math colors
    //

    $katexColorMap: (
        100000: 'brand',
        200000: 'blue',
        300000: 'green',
        400000: 'yellow',
        500000: 'red',
    );

    @each $katexCode, $cssVarCode in $katexColorMap {
        [style*=#{('"color:#' + $katexCode + '"')}] {
            color: var(--katex-color_#{$cssVarCode}) !important;
        }
    }
}

.latexDisplayMath {
    overflow: auto;
    padding: 2px;

    &::-webkit-scrollbar {
        height: 7px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: light-dark(#b6b6b6, #4f4f4f);
    }

    @include bp.below('mobile') {
        overflow-x: scroll;

        &::-webkit-scrollbar {
            height: 5px;
        }
    }

    :global(.base) {
        margin: 0.25em 0;
    }
    :global(.katex-display) {
        margin: 0;
    }

    // Allow automatic line breaks in display math
    &:not(.latexFreeze) {
        :global(.katex-display) > :global(.katex) {
            white-space: normal;
        }
    }
}
</style>
