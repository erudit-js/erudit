<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue';

import type { ParsedElement } from '../../element';
import type { CaptionSchema } from './caption.global';
import Render from '../../app/front/components/Render.vue';

const { caption, fallbackWidth } = defineProps<{
    caption: ParsedElement<CaptionSchema>;
    fallbackWidth?: string;
}>();

const emit = defineEmits(['captionMounted']);

const captionElement = useTemplateRef('caption');

const captionMain = caption.children[0];
const captionSecondary = caption.children[1];

const maxWidth = caption.data.width
    ? `min(${caption.data.width}, 100%)`
    : fallbackWidth
      ? `min(${fallbackWidth}, 100%)`
      : '';

onMounted(() => {
    emit('captionMounted', captionElement.value);
});
</script>

<template>
    <div
        ref="caption"
        class="text-text-muted text-main-sm m-auto text-center"
        v-bind="maxWidth ? { style: { maxWidth } } : {}"
    >
        <div class="font-semibold">
            <Render v-for="child of captionMain.children" :element="child" />
        </div>
        <div v-if="captionSecondary">
            <Render
                v-for="child of captionSecondary.children"
                :element="child"
            />
        </div>
    </div>
</template>
