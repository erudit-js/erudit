<script lang="ts" setup>
import { Bitran, type BitranContent } from '@bitran-js/renderer-vue';

import type { BitranContext } from '@shared/bitran/context';

import RenderWrapper from './RenderWrapper.vue';

const props = defineProps<{
    content: BitranContent;
    context: BitranContext;
}>();

const bitranTranspiler = await useBitranTranspiler();
const bitranRenderers = await useBitranRenderers();

const formatText = useFormatText();

// onMounted(() => {
//     watch(urlElement, () => {
//         //console.log('Highlighting product:', urlElement.value);
//     }, { immediate: true });
// });

const isDev = import.meta.dev;
const isServer = import.meta.server;
</script>

<template>
    <Bitran
        :class="$style.eruditBitranContainer"
        :transpiler="bitranTranspiler"
        :renderers="bitranRenderers"
        :content
        :editMode="false"
        :formatText
        :RenderWrapper
        :isDev
        :isServer
    />
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/def' as bitranDef;
@use '$/def/bp';

.eruditBitranContainer {
    padding: var(--_pMainY) var(--_pMainX);
    padding-left: calc(var(--_pMainX) - #{bitranDef.$asideWidth});

    // Setting up Bitran

    --bitran_gap: var(--gap);
    --bitran_gapSmall: var(--gapSmall);
    --bitran_gapBig: var(--gapBig);
    --bitran_gapBlocks: var(--gapBig);

    --bitran_xPadding: var(--_pMainX);
    --bitran_transitionSpeed: var(--transitionSpeed);
    --bitran_transitionFunction: var(--transitionFunction);

    --bitran_fontMain: 'Noto Sans', sans-serif;
    --bitran_fontAlt: 'Noto Serif', serif;

    --bitran_text: var(--text);
    --bitran_textMuted: var(--textMuted);
    --bitran_textDimmed: var(--textDimmed);
    --bitran_textDisabled: var(--textDisabled);

    --bitran_colorBrand: var(--brand);

    @include bp.below('mobile') {
        --bitran_gapBlocks: calc(22px);
    }
}
</style>
