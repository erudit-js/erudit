<script lang="ts" setup>
import type { ToProseElement } from 'tsprose';

import type { EmphasisSchema } from './core.js';
import Render from '../../app/shared/Render.vue';

defineProps<{ element: ToProseElement<EmphasisSchema> }>();
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
