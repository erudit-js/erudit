<script lang="ts" setup>
import type { ContentFlag } from 'erudit-cog/schema';
import { flagsData } from '@app/scripts/flag';

defineProps<{ flags: Record<ContentFlag, boolean> }>();

const phrases = Object.values(flagsData).map((data) => data.title);
const phrase = await usePhrases(...phrases);
</script>

<template>
    <div :class="$style.flags">
        <MyIcon
            v-for="(value, flag) in flags"
            :name="flagsData[flag].icon"
            :title="phrase[flagsData[flag].title]"
            :class="$style.flag"
        />
    </div>
</template>

<style lang="scss" module>
.flags {
    display: flex;
    align-items: center;
    gap: var(--gapSmall);
}

.flag {
    cursor: help;
    font-size: 16px;
    color: var(--textDimmed);
    opacity: 0.65;
    @include transition(opacity);

    &:hover {
        opacity: 1;
    }
}
</style>
