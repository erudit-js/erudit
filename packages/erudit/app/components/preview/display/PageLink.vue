<script lang="ts" setup>
import type { PreviewDataPageLink } from '@app/scripts/preview/data/pageLink';
import type { PreviewDisplayProps } from '@app/scripts/preview/display';

const { data } = defineProps<PreviewDisplayProps<PreviewDataPageLink>>();

const phrase = await usePhrases('internal_link_warn');
</script>

<template>
    <PreviewDisplay :footer="data.footer">
        <div :class="$style.wrapper">
            {{ data.description || phrase.internal_link_warn }}
        </div>
    </PreviewDisplay>
</template>

<style lang="scss" module>
.wrapper {
    padding: var(--gapBig);
}
</style>
