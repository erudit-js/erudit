<script lang="ts" setup>
import { type mixSchema, type ProseElement } from '@jsprose/core';

import Render from '../shared/Render.vue';

const { element } = defineProps<{ element: ProseElement<typeof mixSchema> }>();
</script>

<template>
  <Render v-for="child of element.children" :element="child" />
</template>
