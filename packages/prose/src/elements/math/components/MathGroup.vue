<script lang="ts" setup>
import type { MathGroup } from '../block.js';
import Katex from './Katex.vue';

const { mathGroup } = defineProps<{
  mathGroup: MathGroup;
  freeze: boolean;
}>();

const columnGap = (() => {
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
      <MathGroup v-else :mathGroup="part" :freeze="freeze" />
    </template>
  </div>
</template>
