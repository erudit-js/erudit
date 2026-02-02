<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import {
  type blockMathSchema,
  type MathGroup as _MathGroup,
  createBlockMathStorage,
} from '../block.js';
import { useElementStorage } from '../../../app/composables/storage.js';
import MathGroup from './MathGroup.vue';
import Block from '../../../app/shared/block/Block.vue';

const { element } = defineProps<{
  element: ProseElement<typeof blockMathSchema>;
}>();

const blockMathStorage =
  (await useElementStorage<typeof blockMathSchema>(element)) ??
  (await createBlockMathStorage(element.data.katex));

const mathGroup: _MathGroup = blockMathStorage;
</script>

<template>
  <Block :element>
    <div :style="{ '--mathRowGap': '1em' }">
      <MathGroup :mathGroup :freeze="Boolean(element.data.freeze)" />
    </div>
  </Block>
</template>
