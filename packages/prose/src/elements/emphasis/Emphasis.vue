<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { emphasisSchema } from './core.js';
import Render from '../../app/shared/Render.vue';

defineProps<{ element: ProseElement<typeof emphasisSchema> }>();
</script>

<template>
  <strong
    v-if="element.data.type === 'bold'"
    :class="[
      'font-semibold',
      element.data?.accent
        ? 'text-(--accentText,var(--color-text-deep))'
        : 'text-text-deep',
    ]"
  >
    <Render v-for="child of element.children" :element="child" />
  </strong>
  <i v-else>
    <Render v-for="child of element.children" :element="child" />
  </i>
</template>
