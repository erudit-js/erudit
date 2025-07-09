<script lang="ts" setup>
import type { Stats } from '@shared/stat';

defineProps<{ stats: Stats }>();
</script>

<template>
    <section :class="$style.stats">
        <template v-for="stat of stats">
            <StatsItem v-if="stat.type === 'custom'" v-bind:stat />
            <StatsItemElement v-else v-bind:stat />
        </template>
    </section>
</template>

<style lang="scss" module>
.stats {
    display: flex;
    flex-wrap: wrap;
}
</style>
