<script lang="ts" setup>
import type { MixSchema, ToProseElement } from 'tsprose';

import Render from '../shared/Render.vue';

const { element } = defineProps<{ element: ToProseElement<MixSchema> }>();
</script>

<template>
  <Render v-for="child of element.children" :element="child" />
</template>
