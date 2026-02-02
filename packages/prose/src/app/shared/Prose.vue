<script lang="ts" setup>
import { provide } from 'vue';
import type { AnySchema, GenericStorage, ProseElement } from '@jsprose/core';
import { createFormatTextState } from '@erudit-js/core/formatText';

import {
  proseContextSymbol,
  type ProseContext,
} from '../composables/context.js';
import { proseStorageSymbol } from '../composables/storage.js';
import Render from './Render.vue';
import { anchorStateSymbol, useAnchorState } from '../composables/anchor.js';
import { formatTextStateSymbol } from '../composables/formatText.js';

const { element, storage, context } = defineProps<{
  element: ProseElement<AnySchema>;
  storage: GenericStorage;
  context: ProseContext;
}>();

provide(proseContextSymbol, context);
provide(proseStorageSymbol, storage);

const anchorState = useAnchorState(context.hashUrl, element);
provide(anchorStateSymbol, anchorState);

provide(formatTextStateSymbol, createFormatTextState());
</script>

<template>
  <section
    :style="{ '--proseGap': 'none' }"
    :class="[
      /* Variables */
      'micro:[--proseAsideWidth:20px] [--proseAsideWidth:16px]',
    ]"
  >
    <Render :element />
  </section>
</template>
