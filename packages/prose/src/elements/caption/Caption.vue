<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue';
import { isProseElement, type ToProseElement } from 'tsprose';

import { captionSecondarySchema, type CaptionSchema } from './core.js';
import Render from '../../app/shared/Render.vue';

const { caption } = defineProps<{
  caption: ToProseElement<CaptionSchema>;
}>();

const emit = defineEmits(['captionMounted']);

const captionElement = useTemplateRef('caption');

const captionSecondary = caption.children.find((child) =>
  isProseElement(child, captionSecondarySchema),
);
const mainInliners = caption.children.filter(
  (child) => child !== captionSecondary,
);

const width = caption.data?.width ? `min(${caption.data.width}, 100%)` : '';

onMounted(() => {
  emit('captionMounted', captionElement.value);
});
</script>

<template>
  <div
    ref="caption"
    class="**:text-text-muted text-main-sm mt-small micro:mt-normal m-auto
      text-center"
    v-bind="width ? { style: { width } } : {}"
  >
    <div class="font-semibold">
      <Render v-for="child of mainInliners" :element="child" />
    </div>
    <div v-if="captionSecondary">
      <Render v-for="child of captionSecondary.children" :element="child" />
    </div>
  </div>
</template>
