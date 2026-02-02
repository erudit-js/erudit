<script lang="ts" setup>
import type { InlinerSchema, ProseElement } from '@jsprose/core';

defineProps<{ element: ProseElement<InlinerSchema> }>();
</script>

<template>
  <span>
    <slot></slot>
  </span>
</template>
