<script setup lang="ts">
import type { ToProseElement } from 'tsprose';

import type { ParagraphSchema } from './core.js';
import Block from '../../app/shared/block/Block.vue';
import Render from '../../app/shared/Render.vue';

defineProps<{ element: ToProseElement<ParagraphSchema> }>();
</script>

<template>
  <Block :element>
    <div
      :class="[
        'wrap-break-word',
        element.data?.center ? 'text-center' : 'micro:text-justify text-left',
        {
          'font-serif': element.data?.serif,
        },
      ]"
    >
      <Render v-for="child of element.children" :element="child" />
    </div>
  </Block>
</template>
