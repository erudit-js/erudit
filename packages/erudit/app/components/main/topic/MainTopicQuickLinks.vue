<script setup lang="ts">
import type { QuickLinks } from '@erudit/shared/quickLink';

defineProps<{ links: QuickLinks }>();
</script>

<template>
    <QuickLinks :links :class="$style.topicQuickLinks" />
</template>

<style lang="scss" module>
@use '$/def/bp';

.topicQuickLinks {
    padding: var(--_pMainY) var(--_pMainX);
    --_erudit_quickLink_bg: var(--bgAside);

    @include bp.below('mobile') {
        > ul {
            justify-content: center;
        }
    }
}
</style>
