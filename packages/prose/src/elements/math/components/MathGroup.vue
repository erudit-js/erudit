<script lang="ts" setup>
import type { MathGroup } from '../block.js';
import Katex from './Katex.vue';

const { mathGroup } = defineProps<{
  mathGroup: MathGroup;
  freeze: boolean;
}>();

const gap = (() => {
  switch (mathGroup.gap.type) {
    case '0':
      return '0px';
    case 'small':
      return 'var(--proseAsideWidth)';
    case 'normal':
      return 'calc(var(--proseAsideWidth) * 2)';
    case 'big':
      return 'calc(var(--proseAsideWidth) * 4)';
    case 'custom':
      return mathGroup.gap.size;
  }
})();
</script>

<template>
  <div
    :style="{
      '--mathGroupGap': gap,
      gap: 'var(--mathGroupGap)',
      rowGap: 'calc(var(--mathGroupGap)/2)',
      alignItems: mathGroup.alignItems ?? 'center',
    }"
    class="flex flex-wrap justify-center"
  >
    <template v-for="part of mathGroup.parts">
      <Katex
        v-if="typeof part === 'string'"
        mode="block"
        :math="part"
        :freeze
      />
      <MathGroup v-else :mathGroup="part" :freeze="freeze" />
    </template>
  </div>
</template>
