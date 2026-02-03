<script lang="ts" setup>
import { ref } from 'vue';
import type { ProseElement } from '@jsprose/core';

import type { gallerySchema } from './core.js';
import { useElementStorage } from '../../app/composables/storage.js';
import { darkInvert, lightInvert } from '../../app/shared/invert.js';
import Block from '../../app/shared/block/Block.vue';
import ImageElement from '../image/ImageElement.vue';

const { element } = defineProps<{
  element: ProseElement<typeof gallerySchema>;
}>();

const resolvedSources: string[] = [];

for (const child of element.children) {
  const storage = await useElementStorage(child);
  resolvedSources.push(storage.resolvedSrc);
}

const activeI = ref<number>(0);
</script>

<template>
  <Block :element>
    <div class="nice-scrollbars mb-normal flex overflow-auto">
      <div class="gap-normal p-small m-auto flex">
        <button
          v-for="(image, i) of element.children"
          @click="activeI = i"
          :class="[
            `aspect-square w-[70px] cursor-pointer overflow-hidden rounded-xl
            border-2 transition-[border]`,
            {
              'border-border hocus:border-brand': activeI !== i,
              'border-brand': activeI === i,
            },
          ]"
        >
          <img
            :src="resolvedSources[i]"
            :class="[
              'block object-cover',
              {
                [lightInvert]: image.data.invert === 'light',
                [darkInvert]: image.data.invert === 'dark',
              },
            ]"
          />
        </button>
      </div>
    </div>
    <ImageElement :element="element.children[activeI]" :key="activeI" />
  </Block>
</template>
