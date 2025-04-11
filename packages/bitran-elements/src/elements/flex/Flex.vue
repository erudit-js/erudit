<script lang="ts" setup>
import {
    type ElementProps,
    Render,
    useElementParseData,
} from '@bitran-js/renderer-vue';

import { type FlexSchema } from './shared';

defineProps<ElementProps<FlexSchema>>();
const parseData = useElementParseData<FlexSchema>();
</script>

<template>
    <div
        :class="$style.flex"
        :style="{
            ...(parseData.gap && { gap: parseData.gap }),
            ...(parseData.arrange && { justifyContent: parseData.arrange }),
        }"
    >
        <Render :node="parseData.blocks" />
    </div>
</template>

<style lang="scss" module>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: calc(var(--bitran_gapBlocks) - var(--_bitran_asideWidth));
    row-gap: var(--bitran_gapBlocks);
    margin-left: calc(-1 * var(--_bitran_asideWidth));

    :global(.bitran-blockFloat) {
        display: none !important;
    }
}
</style>
