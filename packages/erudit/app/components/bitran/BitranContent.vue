<script lang="ts" setup>
import { Bitran, type BitranContent } from '@bitran-js/renderer-vue';
import {
    setEruditBitranRuntime,
    type BitranContext,
} from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';
import RenderWrapper from './RenderWrapper.vue';

const props = defineProps<{
    context: BitranContext;
}>();

const bitranTranspiler = await useBitranTranspiler();
const bitranRenderers = await useBitranRenderers();

[(bitranTranspiler.parser, bitranTranspiler.stringifier)].forEach((item) => {
    setEruditBitranRuntime(item, {
        eruditConfig,
        insideInclude: false,
        context: props.context,
    });
});

const rawBitranContent = await getBitranContent(props.context.location);
const root = await bitranTranspiler.parser.parse(rawBitranContent.biCode);
const bitranContent: BitranContent = {
    root,
    renderDataStorage: rawBitranContent.renderDataStorage,
};

const formatText = useFormatText();

const isDev = import.meta.dev;
const isServer = import.meta.server;
</script>

<template>
    <Bitran
        :class="$style.eruditBitranContainer"
        :transpiler="bitranTranspiler"
        :renderers="bitranRenderers"
        :content="bitranContent"
        :editMode="false"
        :formatText
        :RenderWrapper
        :isDev
        :isServer
        :language="eruditConfig.language"
    />
</template>

<style lang="scss" module>
@use '$/def/bp';

:global(.bitran-component).eruditBitranContainer {
    padding: var(--_pMainY) var(--_pMainX);
    padding-left: calc(var(--_pMainX) - var(--_bitran_asideWidth));

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
    --bitran_textDeep: var(--textDeep);

    --bitran_colorBrand: var(--brand);

    --bitran_colorBorder: var(--border);

    @include bp.below('mobile') {
        --bitran_gapBlocks: calc(22px);
    }
}
</style>
