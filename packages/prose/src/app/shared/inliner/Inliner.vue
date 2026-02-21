<script lang="ts" setup>
import type { InlinerProseElement } from 'tsprose';

defineProps<{ element: InlinerProseElement }>();
</script>

<template>
  <span>
    <slot></slot>
  </span>
</template>
