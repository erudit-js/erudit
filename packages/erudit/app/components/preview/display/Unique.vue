<script lang="ts" setup>
import { headingName } from '@erudit-js/bitran-elements/heading/shared';

import type { PreviewDataUnique } from '@app/scripts/preview/data/unique';
import type { PreviewDisplayProps } from '@app/scripts/preview/display';

const { data } = defineProps<PreviewDisplayProps<PreviewDataUnique>>();
</script>

<template>
    <PreviewDisplay :footer="data.footer">
        <div
            :class="[
                $style.bitranPreviewContent,
                data.elementName === headingName && $style.heading,
            ]"
        >
            <BitranContent :rawContent="data.rawBitranContent" />
        </div>
    </PreviewDisplay>
</template>

<style lang="scss" module>
.bitranPreviewContent {
    position: relative;
    padding: var(--gap) 0;
}

.heading {
    max-height: 340px;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        background: linear-gradient(to bottom, transparent, var(--bgAside) 95%);
        pointer-events: none;
        touch-action: none;
    }
}
</style>
