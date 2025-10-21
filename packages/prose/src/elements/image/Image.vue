<script setup lang="ts">
import type { ParsedElement } from '../../element';
import type { ImageSchema } from './image.global';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import ImageElement from './ImageElement.vue';

const { element } = defineProps<{ element: ParsedElement<ImageSchema> }>();
</script>

<template>
    <ProseBlock :element>
        <ImageElement :element />
    </ProseBlock>
</template>
