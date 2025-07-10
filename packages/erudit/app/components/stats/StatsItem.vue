<script lang="ts" setup>
import { isMyIcon, type MyIconName } from '#my-icons';
import type { CustomStat } from '@shared/stat';

defineProps<{ stat: CustomStat }>();
</script>

<template>
    <div :class="$style.statsItem" :title="stat.label">
        <MyIcon v-if="isMyIcon(stat.icon)" :name="stat.icon as MyIconName" />
        <MyRuntimeIcon v-else name="stats-item-icon" :svg="stat.icon" />
        <span :class="$style.statsItemCount">{{ stat.count }}</span>
    </div>
</template>

<style lang="scss" module>
.statsItem {
    display: flex;
    gap: var(--gapSmall);
    align-items: center;
    color: var(--textMuted);
    cursor: help;

    .statsItemCount {
        font-weight: 600;
    }

    [my-icon] {
        font-size: 0.9em;
        color: var(--textDimmed);
    }
}
</style>
