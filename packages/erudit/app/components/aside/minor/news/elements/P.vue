<script lang="ts" setup>
import type { ToProseElement } from 'tsprose';
import type { ParagraphSchema } from '@erudit-js/prose/elements/paragraph/core';

import RenderNewsElement from '../RenderNewsElement.vue';

defineProps<{ element: ToProseElement<ParagraphSchema> }>();
</script>

<template>
  <p>
    <RenderNewsElement v-for="child of element.children" :element="child" />
  </p>
</template>
