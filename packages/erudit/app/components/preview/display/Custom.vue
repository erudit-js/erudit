<script lang="ts" setup>
import type { PreviewDataCustom } from '@app/scripts/preview/data/custom';
import type { PreviewDisplayProps } from '@app/scripts/preview/display';

const { data } = defineProps<PreviewDisplayProps<PreviewDataCustom>>();
</script>

<template>
    <PreviewDisplay :footer="data.footer">
        <div :class="$style.message">{{ data.message }}</div>
    </PreviewDisplay>
</template>

<style lang="scss" module>
.message {
    padding: var(--gapBig);
}
</style>
