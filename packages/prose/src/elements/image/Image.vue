<script setup lang="ts">
import type { ToProseElement } from 'tsprose';

import type { ImageSchema } from './core.js';
import Block from '../../app/shared/block/Block.vue';
import ImageElement from './ImageElement.vue';

defineProps<{ element: ToProseElement<ImageSchema> }>();
</script>

<template>
  <Block :element>
    <ImageElement :element />
  </Block>
</template>
