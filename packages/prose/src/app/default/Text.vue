<script lang="ts" setup>
import { Text, h } from 'vue';
import type { TextSchema, ToProseElement } from 'tsprose';

import {
  useFormatText,
  useFormatTextState,
} from '../composables/formatText.js';

const { element } = defineProps<{ element: ToProseElement<TextSchema> }>();
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
