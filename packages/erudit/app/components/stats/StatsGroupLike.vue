<script lang="ts" setup>
import type { Stats } from '@shared/stat';

defineProps<{ stats: Stats }>();
</script>

<template>
    <Stats :stats :class="$style.bookGroupStats" />
</template>

<style lang="scss" module>
@use '$/def/bp';

.bookGroupStats {
    gap: var(--gapBig);
    padding: var(--_pMainY) var(--_pMainX);
    font-size: 1.2em;

    @include bp.below('mobile') {
        justify-content: center;
        gap: var(--gap);
    }
}
</style>
