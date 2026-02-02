<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';
import type { paragraphSchema } from '@erudit-js/prose/elements/paragraph/core';

import RenderNewsElement from '../RenderNewsElement.vue';

defineProps<{ element: ProseElement<typeof paragraphSchema> }>();
</script>

<template>
  <p>
    <RenderNewsElement v-for="child of element.children" :element="child" />
  </p>
</template>
