<script lang="ts" setup>
import type { MixSchema, ToProseElement } from 'tsprose';
import RenderNewsElement from '../RenderNewsElement.vue';

defineProps<{ element: ToProseElement<MixSchema> }>();
</script>

<template>
  <RenderNewsElement v-for="child of element.children" :element="child" />
</template>
