<script lang="ts" setup>
import { Text, h } from 'vue';

import type { TextSchema } from '.';
import type { ParsedElement } from '../../element';

const { element } = defineProps<{ element: ParsedElement<TextSchema> }>();
const TextComponent = h(Text, element.data);
</script>

<template>
    <component :is="TextComponent" />
</template>
