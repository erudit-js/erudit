<script lang="ts" setup>
import { Text, h } from 'vue';
import type { ProseElement, textSchema } from '@jsprose/core';

import { useFormatText } from '../composables/formatText.js';

const { element } = defineProps<{ element: ProseElement<typeof textSchema> }>();
const formatText = useFormatText();
const TextComponent = h(Text, formatText(element.data));
</script>

<template>
    <component :is="TextComponent" />
</template>
