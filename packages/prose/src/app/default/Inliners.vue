<script lang="ts" setup>
import type { inlinersSchema, ProseElement } from '@jsprose/core';

import Render from '../shared/Render.vue';

defineProps<{ element: ProseElement<typeof inlinersSchema> }>();
</script>

<template>
    <Render v-for="child of element.children" :element="child" />
</template>
