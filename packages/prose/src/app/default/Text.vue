<script lang="ts" setup>
import { Text, h } from 'vue';
import type { ProseElement, textSchema } from '@jsprose/core';

import {
    useFormatText,
    useFormatTextState,
} from '../composables/formatText.js';

const { element } = defineProps<{ element: ProseElement<typeof textSchema> }>();
const formatTextState = useFormatTextState();
const formatText = useFormatText();

const originalText = element.data;
const leadingSpace = originalText.match(/^(\s*)/)?.[1] ? ' ' : '';
const trailingSpace = originalText.match(/(\s*)$/)?.[1] ? ' ' : '';
const formattedText = formatText(originalText, formatTextState);
const textWithSpaces = leadingSpace + formattedText + trailingSpace;

const TextComponent = h(Text, textWithSpaces);
</script>

<template>
    <component :is="TextComponent" />
</template>
