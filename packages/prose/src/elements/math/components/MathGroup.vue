<script lang="ts" setup>
import type { MathGroup } from '../block';
import Katex from './Katex.vue';

const { mathGroup } = defineProps<{ mathGroup: MathGroup; freeze: boolean }>();

const columnGap = (() => {
    switch (mathGroup.gap.type) {
        case 'zero':
            return '0px';
        case 'normal':
            return 'var(--proseAsideWidth)';
        case 'big':
            return 'calc(var(--proseAsideWidth) * 2)';
        case 'custom':
            return mathGroup.gap.size;
    }
})();
</script>

<template>
    <div
        :style="{ columnGap }"
        class="flex flex-wrap items-center justify-center gap-y-(--mathRowGap)"
    >
        <template v-for="part of mathGroup.parts">
            <Katex
                v-if="typeof part === 'string'"
                mode="block"
                :math="part"
                :freeze
            />
            <MathGroup v-else :mathGroup :freeze />
        </template>
    </div>
</template>
