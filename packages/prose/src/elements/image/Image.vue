<script setup lang="ts">
import type { ProseElement } from '@jsprose/core';

import type { imageSchema } from './core.js';
import Block from '../../app/shared/block/Block.vue';
import ImageElement from './ImageElement.vue';

defineProps<{ element: ProseElement<typeof imageSchema> }>();
</script>

<template>
  <Block :element>
    <ImageElement :element />
  </Block>
</template>
