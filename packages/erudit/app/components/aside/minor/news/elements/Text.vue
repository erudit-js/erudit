<script lang="ts" setup>
import { Text, h } from 'vue';
import type { ProseElement, textSchema } from '@jsprose/core';

const { element } = defineProps<{ element: ProseElement<typeof textSchema> }>();

const originalText = element.data;
const leadingSpace = originalText.match(/^(\s*)/)?.[1] ? ' ' : '';
const trailingSpace = originalText.match(/(\s*)$/)?.[1] ? ' ' : '';
const formattedText = formatText(originalText);
const textWithSpaces = leadingSpace + formattedText + trailingSpace;

const TextComponent = h(Text, textWithSpaces);
</script>

<template>
    <component :is="TextComponent" />
</template>
