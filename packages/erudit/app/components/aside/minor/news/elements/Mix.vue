<script lang="ts" setup>
import type { mixSchema, ProseElement } from '@jsprose/core';

import RenderNewsElement from '../RenderNewsElement.vue';

defineProps<{ element: ProseElement<typeof mixSchema> }>();
</script>

<template>
    <RenderNewsElement v-for="child of element.children" :element="child" />
</template>
