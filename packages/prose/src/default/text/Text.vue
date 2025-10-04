<script lang="ts" setup>
import { Text, h } from 'vue';

import type { TextSchema } from '.';
import type { ParsedElement } from '../../element';
import { useFormatText } from '../../app/front/composables/formatText';

const { element } = defineProps<{ element: ParsedElement<TextSchema> }>();
const formatText = useFormatText();
const TextComponent = h(Text, formatText(element.data));
</script>

<template>
    <component :is="TextComponent" />
</template>
